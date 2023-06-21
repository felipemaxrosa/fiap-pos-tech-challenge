import { Test, TestingModule } from '@nestjs/testing';
import { Produto } from 'src/domain/produto/model/produto.model';
import { SalvarProdutoValidator } from '../validation/salvar-produto.validator';
import { IRepository } from 'src/domain/repository/repository';
import { IService } from 'src/domain/service/service';
import { ProdutoService } from './produto.service';
import { RepositoryException } from 'src/infrastructure/exception/repository.exception';
import { ServiceException } from 'src/domain/exception/service.exception';
import { CamposObrigatoriosProdutoValidator } from '../validation/campos-obrigatorios-produto.validator';

// Stubs
const produtoSalvar: Produto = {
   id: 1,
   nome: 'nome correto',
   idCategoriaProduto: 1,
   descricao: 'Teste',
   preco: 10,
   imagemBase64: '',
   ativo: true,
};

const produtoEditar: Produto = {
   id: 1,
   nome: 'nome editado',
   idCategoriaProduto: 2,
   descricao: 'Teste editado',
   preco: 101,
   imagemBase64: '',
   ativo: true,
};

describe('ProdutoService', () => {
   let service: IService<Produto>;
   let repository: IRepository<Produto>;
   let validators: SalvarProdutoValidator[];

   beforeEach(async () => {
      // Configuração do módulo de teste
      const module: TestingModule = await Test.createTestingModule({
         providers: [
            //  IService<Produto> provider
            {
               provide: 'IService<Produto>',
               inject: ['IRepository<Produto>', 'SalvarProdutoValidator'],
               useFactory: (
                  repository: IRepository<Produto>,
                  salvarProdutoValidator: SalvarProdutoValidator[],
               ): IService<Produto> => {
                  return new ProdutoService(repository, salvarProdutoValidator);
               },
            },
            // Mock do serviço IRepository<Produto>
            {
               provide: 'IRepository<Produto>',
               useValue: {
                  // mock para a chamada repository.save(produto)
                  save: jest.fn(() => Promise.resolve(produtoSalvar)),
                  // mock para a chamada repository.findBy(attributes)
                  findBy: jest.fn(() => {
                     // retorna vazio, sumulando que não encontrou registros pelo atributos passados por parâmetro
                     return Promise.resolve({});
                  }),
                  // mock para a chamada repository.edit(produto)
                  edit: jest.fn(() => Promise.resolve(produtoEditar)),
               },
            },
            // Mock do SalvarProdutoValidator
            {
               provide: 'SalvarProdutoValidator',
               inject: ['IRepository<Produto>'],
               useFactory: (repository: IRepository<Produto>): SalvarProdutoValidator[] => {
                  return [new CamposObrigatoriosProdutoValidator(repository)];
               },
            },
         ],
      }).compile();

      // Desabilita a saída de log
      module.useLogger(false);

      // Obtém a instância do repositório, validators e serviço a partir do módulo de teste
      repository = module.get<IRepository<Produto>>('IRepository<Produto>');
      validators = module.get<SalvarProdutoValidator[]>('SalvarProdutoValidator');
      service = module.get<IService<Produto>>('IService<Produto>');
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
            imagemBase64: '',
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
            imagemBase64: '',
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
            imagemBase64: '',
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
            imagemBase64: '',
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
            imagemBase64: '',
            ativo: true,
         };

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
            imagemBase64: '',
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
            imagemBase64: '',
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
            imagemBase64: '',
            ativo: true,
         };

         // verifica se foi lançada uma exception com a mensagem de idCategoriaProduto inválido
         await expect(service.edit(produto)).rejects.toThrowError(
            CamposObrigatoriosProdutoValidator.ID_CATEGORIA_PRODUTO_INVALIDO_ERROR_MESSAGE,
         );
      }); // end it não edita produto com idCategoriaProduto inválido

      it('não deve editar produto quando houver um erro de banco ', async () => {
         const error = new RepositoryException('Erro genérico de banco de dados');
         jest.spyOn(repository, 'edit').mockRejectedValue(error);

         // verifica se foi lançada uma exception na camada de serviço
         await expect(service.edit(produtoSalvar)).rejects.toThrowError(ServiceException);
      }); // end it não deve editar produto quando houver um erro de banco
   }); // end describe edit
}); // end describe ProdutoService
