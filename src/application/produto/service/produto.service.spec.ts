import { Test, TestingModule } from '@nestjs/testing';
import { ProdutoProviders } from 'src/application/produto/providers/produto.providers';
import { IProdutoService } from 'src/application/produto/service/produto.service.interface';
import { CamposObrigatoriosProdutoValidator } from 'src/application/produto/validation/campos-obrigatorios-produto.validator';
import { PersistirProdutoValidator } from 'src/application/produto/validation/persistir-produto.validator';
import { ServiceException } from 'src/enterprise/exception/service.exception';
import { Produto } from 'src/enterprise/produto/model/produto.model';
import { IRepository } from 'src/enterprise/repository/repository';
import { RepositoryException } from 'src/infrastructure/exception/repository.exception';
import { PersistenceInMemoryProviders } from 'src/infrastructure/persistence/providers/persistence-in-memory.providers';
import { ProdutoConstants } from 'src/shared/constants';

const IMAGEM_BASE64_SAMPLE =
   'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABAQMAAAAl21bKAAAAA1BMVEUAAACnej3aAAAAAXRSTlMAQObYZgAAAApJREFUCNdjYAAAAAIAAeIhvDMAAAAASUVORK5CYII=';

// Stubs
const produtoSalvar: Produto = {
   id: 1,
   nome: 'nome correto',
   idCategoriaProduto: 1,
   descricao: 'Teste',
   preco: 10,
   imagemBase64: IMAGEM_BASE64_SAMPLE,
   ativo: true,
};

const produto1ComIdCategoriaProdutoLanche: Produto = {
   id: 1,
   nome: 'algum lanche',
   idCategoriaProduto: 1,
   descricao: 'descrição algum lanche',
   preco: 10,
   imagemBase64: IMAGEM_BASE64_SAMPLE,
   ativo: true,
};

const produto2ComIdCategoriaProdutoLanche: Produto = {
   id: 2,
   nome: 'algum outro lanche',
   idCategoriaProduto: 1,
   descricao: 'descrição algum outro lanche',
   preco: 12,
   imagemBase64: IMAGEM_BASE64_SAMPLE,
   ativo: true,
};

const produto1ComIdCategoriaProdutoBebida: Produto = {
   id: 3,
   nome: 'alguma bebida',
   idCategoriaProduto: 2,
   descricao: 'descrição alguma bebida',
   preco: 6,
   imagemBase64: IMAGEM_BASE64_SAMPLE,
   ativo: true,
};

const produtoEditar: Produto = {
   id: 1,
   nome: 'nome editado',
   idCategoriaProduto: 2,
   descricao: 'Teste editado',
   preco: 101,
   imagemBase64: IMAGEM_BASE64_SAMPLE,
   ativo: true,
};

describe('ProdutoService', () => {
   let service: IProdutoService;
   let repository: IRepository<Produto>;
   let validators: PersistirProdutoValidator[];

   beforeEach(async () => {
      // Configuração do módulo de teste
      const module: TestingModule = await Test.createTestingModule({
         providers: [
            ...ProdutoProviders,
            ...PersistenceInMemoryProviders,
            // Mock do serviço IRepository<Produto>
            {
               provide: ProdutoConstants.IREPOSITORY,
               useValue: {
                  // mock para a chamada repository.save(produto)
                  save: jest.fn(() => Promise.resolve(produtoSalvar)),
                  // mock para a chamada repository.findBy(attributes)
                  findBy: jest.fn(() => {
                     // retorna vazio, simulando que não encontrou registros pelo atributos passados por parâmetro
                     return Promise.resolve({});
                  }),
                  // mock para a chamada repository.findById(id)
                  findById: jest.fn(() => {
                     // retorna vazio, simulando que não encontrou registros pelo id passado por parâmetro
                     return Promise.resolve({});
                  }),
                  // mock para a chamada repository.findByIdCategoriaProduto(idCategoriaProduto)
                  findByIdCategoriaProduto: jest.fn(() => {
                     return Promise.resolve(undefined);
                  }),
                  // mock para a chamada repository.edit(produto)
                  edit: jest.fn(() => Promise.resolve(produtoEditar)),
                  // mock para a chamada repository.delete(id)
                  delete: jest.fn(() => Promise.resolve(true)),
               },
            },
         ],
      }).compile();

      // Desabilita a saída de log
      module.useLogger(false);

      // Obtém a instância do repositório, validators e serviço a partir do módulo de teste
      repository = module.get<IRepository<Produto>>(ProdutoConstants.IREPOSITORY);
      validators = module.get<PersistirProdutoValidator[]>(ProdutoConstants.SALVAR_PRODUTO_VALIDATOR);
      service = module.get<IProdutoService>(ProdutoConstants.ISERVICE);
   });

   describe('injeção de dependências', () => {
      it('deve existir instâncias de repositório e validators definidas', async () => {
         expect(repository).toBeDefined();
         expect(validators).toBeDefined();
      });
   });

   describe('salvar', () => {
      it('salva produtos com campos válidos', async () => {
         const produto: Produto = {
            id: 1,
            nome: 'nome correto',
            idCategoriaProduto: 1,
            descricao: 'Teste',
            preco: 10,
            imagemBase64: IMAGEM_BASE64_SAMPLE,
            ativo: true,
         };

         await service.save(produto).then((produtoSalvo) => {
            // verifica se o produto salvo contém os mesmos dados passados como input
            expect(produtoSalvo.id).toEqual(1);
            expect(produtoSalvo.nome).toEqual(produto.nome);
            expect(produtoSalvo.idCategoriaProduto).toEqual(produto.idCategoriaProduto);
            expect(produtoSalvo.descricao).toEqual(produto.descricao);
            expect(produtoSalvo.preco).toEqual(produto.preco);
            expect(produtoSalvo.imagemBase64).toEqual(produto.imagemBase64);
            expect(produtoSalvo.ativo).toEqual(produto.ativo);
         });
      }); // end it salva produtos com campos válidos

      it('não salva produto com nome inválido', async () => {
         const produto: Produto = {
            id: 1,
            nome: ' ',
            idCategoriaProduto: 1,
            descricao: 'Teste',
            preco: 10,
            imagemBase64: IMAGEM_BASE64_SAMPLE,
            ativo: true,
         };

         // verifica se foi lançada uma exception com a mensagem de validação de campos inválidos
         await expect(service.save(produto)).rejects.toThrowError(
            CamposObrigatoriosProdutoValidator.CAMPOS_INVALIDOS_ERROR_MESSAGE,
         );
      }); // end it não salva produto com nome inválido

      it('não salva produto com preço inválido', async () => {
         const produto: Produto = {
            id: 1,
            nome: ' ',
            idCategoriaProduto: 1,
            descricao: 'Teste',
            preco: -10,
            imagemBase64: IMAGEM_BASE64_SAMPLE,
            ativo: true,
         };

         // verifica se foi lançada uma exception com a mensagem de validação de campos inválidos
         await expect(service.save(produto)).rejects.toThrowError(
            CamposObrigatoriosProdutoValidator.CAMPOS_INVALIDOS_ERROR_MESSAGE,
         );
      }); // end it não salva produto com preço inválido

      it('não salva produto com idCategoriaProduto inválido', async () => {
         const produto: Produto = {
            id: 1,
            nome: 'nome correto',
            idCategoriaProduto: 100,
            descricao: 'Teste',
            preco: 10,
            imagemBase64: IMAGEM_BASE64_SAMPLE,
            ativo: true,
         };

         // verifica se foi lançada uma exception com a mensagem de idCategoriaProduto inválido
         await expect(service.save(produto)).rejects.toThrowError(
            CamposObrigatoriosProdutoValidator.ID_CATEGORIA_PRODUTO_INVALIDO_ERROR_MESSAGE,
         );
      }); // end it não salva produto com preço inválido

      it('não deve salvar produto quando houver um erro de banco ', async () => {
         const error = new RepositoryException('Erro genérico de banco de dados');
         jest.spyOn(repository, 'save').mockRejectedValue(error);

         // verifica se foi lançada uma exception na camada de serviço
         await expect(service.save(produtoSalvar)).rejects.toThrowError(ServiceException);
      }); // end it não deve salvar produto quando houver um erro de banco
   }); // end describe save

   describe('editar', () => {
      it('edita produtos com campos válidos', async () => {
         const produto: Produto = {
            id: 1,
            nome: 'nome editado',
            idCategoriaProduto: 2,
            descricao: 'Teste editado',
            preco: 101,
            imagemBase64: IMAGEM_BASE64_SAMPLE,
            ativo: true,
         };

         repository.findBy = jest.fn().mockResolvedValue([produtoEditar]);
         await service.edit(produto).then((produtoEditado) => {
            // verifica se o produto salvo contém os mesmos dados passados como input
            expect(produtoEditado.id).toEqual(1);
            expect(produtoEditado.nome).toEqual(produto.nome);
            expect(produtoEditado.idCategoriaProduto).toEqual(produto.idCategoriaProduto);
            expect(produtoEditado.descricao).toEqual(produto.descricao);
            expect(produtoEditado.preco).toEqual(produto.preco);
            expect(produtoEditado.imagemBase64).toEqual(produto.imagemBase64);
            expect(produtoEditado.ativo).toEqual(produto.ativo);
         });
      }); // end it edita produtos com campos válidos

      it('não edita produto com nome inválido', async () => {
         const produto: Produto = {
            id: 1,
            nome: ' ',
            idCategoriaProduto: 1,
            descricao: 'Teste',
            preco: 10,
            imagemBase64: IMAGEM_BASE64_SAMPLE,
            ativo: true,
         };

         // verifica se foi lançada uma exception com a mensagem de validação de campos inválidos
         await expect(service.edit(produto)).rejects.toThrowError(
            CamposObrigatoriosProdutoValidator.CAMPOS_INVALIDOS_ERROR_MESSAGE,
         );
      }); // end it não edita produto com nome inválido

      it('não edita produto com preço inválido', async () => {
         const produto: Produto = {
            id: 1,
            nome: ' ',
            idCategoriaProduto: 1,
            descricao: 'Teste',
            preco: -10,
            imagemBase64: IMAGEM_BASE64_SAMPLE,
            ativo: true,
         };

         // verifica se foi lançada uma exception com a mensagem de validação de campos inválidos
         await expect(service.edit(produto)).rejects.toThrowError(
            CamposObrigatoriosProdutoValidator.CAMPOS_INVALIDOS_ERROR_MESSAGE,
         );
      }); // end it não edita produto com preço inválido

      it('não edita produto com idCategoriaProduto inválido', async () => {
         const produto: Produto = {
            id: 1,
            nome: 'nome correto',
            idCategoriaProduto: 100,
            descricao: 'Teste',
            preco: 10,
            imagemBase64: IMAGEM_BASE64_SAMPLE,
            ativo: true,
         };

         // verifica se foi lançada uma exception com a mensagem de idCategoriaProduto inválido
         await expect(service.edit(produto)).rejects.toThrowError(
            CamposObrigatoriosProdutoValidator.ID_CATEGORIA_PRODUTO_INVALIDO_ERROR_MESSAGE,
         );
      }); // end it não edita produto com idCategoriaProduto inválido

      it('não deve editar produto quando houver um erro de banco ', async () => {
         const error = new RepositoryException('Erro genérico de banco de dados');
         repository.findBy = jest.fn().mockResolvedValue([produtoEditar]);
         jest.spyOn(repository, 'edit').mockRejectedValue(error);

         // verifica se foi lançada uma exception na camada de serviço
         await expect(service.edit(produtoSalvar)).rejects.toThrowError(ServiceException);
      }); // end it não deve editar produto quando houver um erro de banco
   }); // end describe editar

   describe('deletar', () => {
      it('deleta produto', async () => {
         repository.findBy = jest.fn().mockResolvedValue([produtoEditar]);
         await service.delete(1).then((result) => {
            expect(result).toBeTruthy();
         });
      }); // end it deleta produto

      it('não deve deletar produto quando houver um erro de banco ', async () => {
         const error = new RepositoryException('Erro genérico de banco de dados');
         repository.findBy = jest.fn().mockResolvedValue([produtoEditar]);
         jest.spyOn(repository, 'delete').mockRejectedValue(error);

         // verifica se foi lançada uma exception na camada de serviço
         await expect(service.delete(1)).rejects.toThrowError(ServiceException);
      }); // end it não deve deletar produto quando houver um erro de banco
   }); // end describe deletar

   describe('findById', () => {
      it('encontra produto por id', async () => {
         repository.findBy = jest.fn().mockImplementation((attributes) => {
            return Promise.resolve(attributes['id'] === produtoSalvar.id ? [produtoSalvar] : {});
         });
         await service.findById(1).then((produtoEncontrado) => {
            expect(produtoEncontrado).toEqual(produtoSalvar);
         });
      }); // end it encontra produto por id

      it('não encontra produto por id', async () => {
         await service.findById(2).then((produtoEncontrado) => {
            expect(produtoEncontrado).toEqual(undefined);
         });
      }); // end it não encontra produto por id

      it('não deve encontrar produto por id quando houver um erro de banco ', async () => {
         const error = new RepositoryException('Erro genérico de banco de dados');
         jest.spyOn(repository, 'findBy').mockRejectedValue(error);

         // verifica se foi lançada uma exception na camada de serviço
         await expect(service.findById(1)).rejects.toThrowError(ServiceException);
      }); // end it não deve encontrar produto por id quando houver um erro de banco
   }); // end describe findById

   describe('findByIdCategoriaProduto', () => {
      it('encontra 2 produtos por IdCategoriaProduto = 1', async () => {
         repository.findBy = jest.fn().mockImplementation((attributes) => {
            return Promise.resolve(
               attributes['idCategoriaProduto'] === 1
                  ? [produto1ComIdCategoriaProdutoLanche, produto2ComIdCategoriaProdutoLanche]
                  : {},
            );
         });
         await service.findByIdCategoriaProduto(1).then((produtosEncontrados) => {
            expect(produtosEncontrados).toEqual([
               produto1ComIdCategoriaProdutoLanche,
               produto2ComIdCategoriaProdutoLanche,
            ]);
         });
      }); // end it encontra 2 produtos por IdCategoriaProduto = 1

      it('encontra 1 produtos por IdCategoriaProduto = 2', async () => {
         repository.findBy = jest.fn().mockImplementation((attributes) => {
            return Promise.resolve(attributes['idCategoriaProduto'] === 2 ? [produto1ComIdCategoriaProdutoBebida] : {});
         });
         await service.findByIdCategoriaProduto(2).then((produtosEncontrados) => {
            expect(produtosEncontrados).toEqual([produto1ComIdCategoriaProdutoBebida]);
         });
      }); // end it encontra 1 produtos por IdCategoriaProduto = 2

      it('não encontra produto por idCategoriaProduto', async () => {
         await service.findByIdCategoriaProduto(3).then((produtoEncontrado) => {
            expect(produtoEncontrado).toEqual(undefined);
         });
      }); // end it não encontra produto por idCategoriaProduto

      it('não deve encontrar produto por idCategoriaProduto quando houver um erro de banco ', async () => {
         const error = new RepositoryException('Erro genérico de banco de dados');
         jest.spyOn(repository, 'findBy').mockRejectedValue(error);

         // verifica se foi lançada uma exception na camada de serviço
         await expect(service.findByIdCategoriaProduto(1)).rejects.toThrowError(ServiceException);
      }); // end it não deve encontrar produto por idCategoriaProduto quando houver um erro de banco
   }); // end describe findByIdCategoriaProduto
}); // end describe ProdutoService
