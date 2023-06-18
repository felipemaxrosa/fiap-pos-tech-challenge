import { Test, TestingModule } from '@nestjs/testing';
import { Produto } from 'src/domain/produto/model/produto.model';
import { IRepository } from 'src/domain/repository/repository';
import { ProdutoEntity } from '../entity/produto.entity';
import { Repository, TypeORMError } from 'typeorm';
import { ProdutoTypeormRepository } from './produto-typeorm.repository';
import { RepositoryException } from '../../../exception/repository.exception';

describe('ProdutoTypeormRepository', () => {
   let repository: IRepository<Produto>;
   let repositoryTypeOrm: Repository<ProdutoEntity>;

   const produto: Produto = {
      id: 1,
      nome: 'Nome teste',
      idCategoriaProduto: 1,
      descricao: 'Descrição teste',
      preco: 10,
      imagemBase64: '',
      ativo: true,
   };

   const produtoEntity: ProdutoEntity = {
      id: 1,
      nome: 'Nome teste',
      idCategoriaProduto: 1,
      descricao: 'Descrição teste',
      preco: 10,
      imagemBase64: '',
      ativo: true,
   };

   beforeEach(async () => {
      // Configuração do módulo de teste
      const module: TestingModule = await Test.createTestingModule({
         providers: [
            //  IRepository<Produto> provider
            {
               provide: 'IRepository<Produto>',
               inject: ['Repository<ProdutoEntity>'],
               useFactory: (repositoryTypeOrm: Repository<ProdutoEntity>): IRepository<Produto> => {
                  return new ProdutoTypeormRepository(repositoryTypeOrm);
               },
            },
            // Mock do serviço Repository<ProdutoEntity>
            {
               provide: 'Repository<ProdutoEntity>',
               useValue: {
                  // mock para a chamama repositoryTypeOrm.save(produto)
                  save: jest.fn(() => Promise.resolve(produtoEntity)),
                  // mock para a chamama repositoryTypeOrm.findBy(attributes)
                  findBy: jest.fn(() => {
                     return Promise.resolve([produtoEntity]);
                  }),
               },
            },
         ],
      }).compile();

      // Desabilita a saída de log
      module.useLogger(false);

      // Obtém a instância dos repositórios
      repository = module.get<IRepository<Produto>>('IRepository<Produto>');
      repositoryTypeOrm = module.get<Repository<ProdutoEntity>>('Repository<ProdutoEntity>');
   });

   describe('injeção de dependências', () => {
      it('deve existir instâncias de repositório type orm definida', async () => {
         expect(repositoryTypeOrm).toBeDefined();
      });
   });

   describe('save', () => {
      it('deve salvar produto corretamente', async () => {
         const repositorySpy = jest.spyOn(repositoryTypeOrm, 'save');

         await repository.save(produto).then((produtoSalvo) => {
            // verifica se o produto salvo contém os mesmos dados passados como input
            validateExpectations(produtoSalvo, produto);
         });
         expect(repositorySpy).toBeCalled();
      }); // end it deve salvar produto corretamente

      it('não deve salvar produto quando houver um erro de banco ', async () => {
         const error = new TypeORMError('Erro genérico do TypeORM');
         jest.spyOn(repositoryTypeOrm, 'save').mockRejectedValue(error);

         // verifica se foi lançada uma exception na camada infra
         await expect(repository.save(produto)).rejects.toThrowError(RepositoryException);
      }); // end it não deve salvar produto quando houver um erro de banco
   }); // end describe save

   describe('findBy', () => {
      it('deve buscar produto pelo id', async () => {
         repositoryTypeOrm.findBy = jest.fn().mockImplementation((attributes) => {
            return Promise.resolve(attributes['id'] === produto.id ? [produtoEntity] : {});
         });

         await repository.findBy({ id: produto.id }).then((produtosEncontrados) => {
            // verifica se o produto salvo contém os mesmos dados passados como input
            expect(produtosEncontrados.length).toEqual(1);
            produtosEncontrados.forEach((produtoEncontrado) => {
               validateExpectations(produtoEncontrado, produto);
            });
         });
      }); // end it deve buscar produto pelo id
   }); // end describe findBy
   it('deve buscar produto pelo nome', async () => {
      repositoryTypeOrm.findBy = jest.fn().mockImplementation((attributes) => {
         return Promise.resolve(attributes['nome'] === produto.nome ? [produtoEntity] : {});
      });

      await repository.findBy({ nome: produto.nome }).then((produtosEncontrados) => {
         // verifica se o produto salvo contém os mesmos dados passados como input
         produtosEncontrados.forEach((produtoEncontrado) => {
            validateExpectations(produtoEncontrado, produto);
         });
      });
   }); // end it deve buscar produto pelo nome
   it('erros de banco na busca devem lançar uma exceção na camada de infra', async () => {
      const error = new TypeORMError('Erro genérico do TypeORM');
      jest.spyOn(repositoryTypeOrm, 'findBy').mockRejectedValue(error);

      // verifica se foi lançada uma exception na camada infra
      await expect(repository.findBy({})).rejects.toThrowError(RepositoryException);
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
