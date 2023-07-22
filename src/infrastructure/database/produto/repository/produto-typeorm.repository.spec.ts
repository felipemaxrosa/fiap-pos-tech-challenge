import { Repository, TypeORMError } from 'typeorm';
import { Test, TestingModule } from '@nestjs/testing';

import { ProdutoConstants } from '../../../../shared/constants';
import { Produto } from '../../../../domain/produto/model/produto.model';
import { IRepository } from '../../../../domain/repository/repository';
import { RepositoryException } from '../../../exception/repository.exception';
import { ProdutoEntity } from '../entity/produto.entity';
import { ProdutoTypeormRepository } from './produto-typeorm.repository';

describe('ProdutoTypeormRepository', () => {
   let repository: IRepository<Produto>;
   let repositoryTypeOrm: Repository<ProdutoEntity>;

   const produtoSalvar: Produto = {
      id: 1,
      nome: 'Nome teste',
      idCategoriaProduto: 1,
      descricao: 'Descrição teste',
      preco: 10,
      imagemBase64: '',
      ativo: true,
   };

   const produtoSalvarEntity: ProdutoEntity = {
      id: 1,
      nome: 'Nome teste',
      idCategoriaProduto: 1,
      descricao: 'Descrição teste',
      preco: 10,
      imagemBase64: '',
      ativo: true,
   };

   const produtoEditar: Produto = {
      id: 1,
      nome: 'Nome editado',
      idCategoriaProduto: 2,
      descricao: 'Descrição editada',
      preco: 100,
      imagemBase64: '',
      ativo: true,
   };

   const produtoEditarEntity: ProdutoEntity = {
      id: 1,
      nome: 'Nome editado',
      idCategoriaProduto: 2,
      descricao: 'Descrição editada',
      preco: 100,
      imagemBase64: '',
      ativo: true,
   };

   const produtoDeletarEntity: ProdutoEntity = {
      id: 1,
      nome: 'Nome',
      idCategoriaProduto: 1,
      descricao: 'Descrição',
      preco: 100,
      imagemBase64: '',
      ativo: false,
   };

   beforeEach(async () => {
      // Configuração do módulo de teste
      const module: TestingModule = await Test.createTestingModule({
         providers: [
            //  IRepository<Produto> provider
            {
               provide: ProdutoConstants.IREPOSITORY,
               inject: [ProdutoConstants.REPOSITORY_PRODUTO_ENTITY],
               useFactory: (repositoryTypeOrm: Repository<ProdutoEntity>): IRepository<Produto> => {
                  return new ProdutoTypeormRepository(repositoryTypeOrm);
               },
            },
            // Mock do serviço Repository<ProdutoEntity>
            {
               provide: ProdutoConstants.REPOSITORY_PRODUTO_ENTITY,
               useValue: {
                  // mock para a chamada repositoryTypeOrm.save(produto)
                  save: jest.fn(),
                  // mock para a chamada repositoryTypeOrm.findBy(attributes)
                  findBy: jest.fn(),
                  // mock para a chamada repositoryTypeOrm.save(produto)
                  edit: jest.fn(),
               },
            },
         ],
      }).compile();

      // Desabilita a saída de log
      module.useLogger(false);

      // Obtém a instância dos repositórios
      repository = module.get<IRepository<Produto>>(ProdutoConstants.IREPOSITORY);
      repositoryTypeOrm = module.get<Repository<ProdutoEntity>>(ProdutoConstants.REPOSITORY_PRODUTO_ENTITY);
   });

   describe('injeção de dependências', () => {
      it('deve existir instâncias de repositório type orm definida', async () => {
         expect(repositoryTypeOrm).toBeDefined();
      });
   });

   describe('save', () => {
      it('deve salvar produto corretamente', async () => {
         const repositorySpy = jest.spyOn(repositoryTypeOrm, 'save').mockResolvedValue(produtoSalvarEntity);

         await repository.save(produtoSalvar).then((produtoSalvo) => {
            // verifica se o produto salvo contém os mesmos dados passados como input
            validateExpectations(produtoSalvo, produtoSalvar);
         });
         expect(repositorySpy).toBeCalled();
      }); // end it deve salvar produto corretamente

      it('não deve salvar produto quando houver um erro de banco ', async () => {
         const error = new TypeORMError('Erro genérico do TypeORM');
         jest.spyOn(repositoryTypeOrm, 'save').mockRejectedValue(error);

         // verifica se foi lançada uma exception na camada infra
         await expect(repository.save(produtoSalvar)).rejects.toThrowError(RepositoryException);
      }); // end it não deve salvar produto quando houver um erro de banco
   }); // end describe save

   describe('findBy', () => {
      it('deve buscar produto pelo id', async () => {
         repositoryTypeOrm.findBy = jest.fn().mockImplementation((attributes) => {
            return Promise.resolve(attributes['id'] === produtoSalvar.id ? [produtoSalvarEntity] : {});
         });

         await repository.findBy({ id: produtoSalvar.id }).then((produtosEncontrados) => {
            // verifica se o produto salvo contém os mesmos dados passados como input
            expect(produtosEncontrados.length).toEqual(1);
            produtosEncontrados.forEach((produtoEncontrado) => {
               validateExpectations(produtoEncontrado, produtoSalvar);
            });
         });
      }); // end it deve buscar produto pelo id
   }); // end describe findBy
   it('deve buscar produto pelo nome', async () => {
      repositoryTypeOrm.findBy = jest.fn().mockImplementation((attributes) => {
         return Promise.resolve(attributes['nome'] === produtoSalvar.nome ? [produtoSalvarEntity] : {});
      });

      await repository.findBy({ nome: produtoSalvar.nome }).then((produtosEncontrados) => {
         // verifica se o produto salvo contém os mesmos dados passados como input
         produtosEncontrados.forEach((produtoEncontrado) => {
            validateExpectations(produtoEncontrado, produtoSalvar);
         });
      });
   }); // end it deve buscar produto pelo nome
   it('erros de banco na busca devem lançar uma exceção na camada de infra', async () => {
      const error = new TypeORMError('Erro genérico do TypeORM');
      jest.spyOn(repositoryTypeOrm, 'findBy').mockRejectedValue(error);

      // verifica se foi lançada uma exception na camada infra
      await expect(repository.findBy({})).rejects.toThrowError(RepositoryException);
   }); // end it erros de banco na busca devem lançar uma exceção na camada de infra

   describe('edit', () => {
      it('deve editar produto corretamente', async () => {
         const repositorySpy = jest.spyOn(repositoryTypeOrm, 'save').mockResolvedValue(produtoEditarEntity);

         await repository.edit(produtoEditar).then((produtoEditado) => {
            // verifica se o produto editado contém os mesmos dados passados como input
            validateExpectations(produtoEditado, produtoEditar);
         });
         expect(repositorySpy).toBeCalled();
      }); // end it deve editar produto corretamente

      it('não deve editar produto quando houver um erro de banco ', async () => {
         const error = new TypeORMError('Erro genérico do TypeORM');
         jest.spyOn(repositoryTypeOrm, 'save').mockRejectedValue(error);

         // verifica se foi lançada uma exception na camada infra
         await expect(repository.edit(produtoEditar)).rejects.toThrowError(RepositoryException);
      }); // end it não deve editar produto quando houver um erro de banco
   }); // end describe edit

   describe('delete', () => {
      it('deve deletar produto corretamente', async () => {
         jest.spyOn(repositoryTypeOrm, 'findBy').mockResolvedValue([produtoDeletarEntity]);
         const repositorySpy = jest.spyOn(repositoryTypeOrm, 'save').mockResolvedValue(produtoDeletarEntity);

         await repository.delete(1).then((result) => {
            expect(result).toBeTruthy();
         });
         expect(repositorySpy).toBeCalled();
      }); // end it deve deletar produto corretamente

      it('não deve deletar produto quando houver um erro de banco ', async () => {
         const error = new TypeORMError('Erro genérico do TypeORM');
         jest.spyOn(repositoryTypeOrm, 'findBy').mockResolvedValue([produtoDeletarEntity]);
         jest.spyOn(repositoryTypeOrm, 'save').mockRejectedValue(error);

         // verifica se foi lançada uma exception na camada infra
         await expect(repository.delete(1)).rejects.toThrowError(RepositoryException);
      }); // end it não deve deletar produto quando houver um erro de banco
   }); // end describe edit

   describe('findAll', () => {
      it('findAll deve falhar porque não foi implementado', async () => {
         try {
            await expect(repository.findAll());
         } catch (error) {
            expect(error.message).toEqual('Método não implementado.');
         }
      });
   });
}); // end describe ProdutoTypeormRepository

// método para reaproveitar código de checar Expectations
function validateExpectations(actualProduto: Produto, expectedProduto: Produto): void {
   expect(actualProduto.id).toEqual(expectedProduto.id);
   expect(actualProduto.idCategoriaProduto).toEqual(expectedProduto.idCategoriaProduto);
   expect(actualProduto.nome).toEqual(expectedProduto.nome);
   expect(actualProduto.descricao).toEqual(expectedProduto.descricao);
   expect(actualProduto.preco).toEqual(expectedProduto.preco);
   expect(actualProduto.imagemBase64).toEqual(expectedProduto.imagemBase64);
   expect(actualProduto.ativo).toEqual(expectedProduto.ativo);
}
