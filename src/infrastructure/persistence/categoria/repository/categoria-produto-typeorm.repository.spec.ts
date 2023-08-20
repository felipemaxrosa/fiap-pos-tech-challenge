import { Test, TestingModule } from '@nestjs/testing';
import { CategoriaProduto } from 'src/enterprise/categoria/model/categoria-produto.model';
import { IRepository } from 'src/enterprise/repository/repository';
import { RepositoryException } from 'src/infrastructure/exception/repository.exception';
import { CategoriaProdutoEntity } from 'src/infrastructure/persistence/categoria/entity/categoria-produto.entity';
import { CategoriaProdutoTypeormRepository } from 'src/infrastructure/persistence/categoria/repository/categoria-produto-typeorm.repository';
import { CategoriaProdutoConstants } from 'src/shared/constants';
import { Repository, TypeORMError } from 'typeorm';

describe('CategoriaProdutoTypeormRepository', () => {
   let repository: IRepository<CategoriaProduto>;
   let repositoryTypeOrm: Repository<CategoriaProdutoEntity>;

   const categoriaProdutos: Array<CategoriaProduto> = [
      { id: 1, nome: 'Lanche' },
      { id: 2, nome: 'Acompanhamento' },
      { id: 3, nome: 'Bebida' },
      { id: 4, nome: 'Sobremesa' },
   ];

   beforeEach(async () => {
      // Configuração do módulo de teste
      const module: TestingModule = await Test.createTestingModule({
         providers: [
            //  IRepository<CategoriaProduto> provider
            {
               provide: CategoriaProdutoConstants.IREPOSITORY,
               inject: [CategoriaProdutoConstants.REPOSITORY_ENTITY],
               useFactory: (repositoryTypeOrm: Repository<CategoriaProdutoEntity>): IRepository<CategoriaProduto> => {
                  return new CategoriaProdutoTypeormRepository(repositoryTypeOrm);
               },
            },
            // Mock do serviço Repository<CategoriaProdutoEntity>
            {
               provide: CategoriaProdutoConstants.REPOSITORY_ENTITY,
               useValue: {
                  // mock para a chamada repositoryTypeOrm.find()
                  find: jest.fn(() => {
                     return Promise.resolve(categoriaProdutos);
                  }),
               },
            },
         ],
      }).compile();

      // Desabilita a saída de log
      module.useLogger(false);

      // Obtém a instância dos repositórios
      repository = module.get<IRepository<CategoriaProduto>>(CategoriaProdutoConstants.IREPOSITORY);
      repositoryTypeOrm = module.get<Repository<CategoriaProdutoEntity>>(CategoriaProdutoConstants.REPOSITORY_ENTITY);
   });

   describe('injeção de dependências', () => {
      it('deve existir instâncias de repositório type orm definida', async () => {
         expect(repositoryTypeOrm).toBeDefined();
      });
   });

   describe('save', () => {
      it('salvar deve falhar porque não foi implementado', async () => {
         await expect(repository.save(categoriaProdutos[0])).rejects.toThrow(
            new RepositoryException('Método não implementado.'),
         );
      });
   }); // end describe save

   describe('findBy', () => {
      it('findBy deve falhar porque não foi implementado', async () => {
         await expect(repository.findBy({})).rejects.toThrow(new RepositoryException('Método não implementado.'));
      });
   }); // end describe findBy

   describe('edit', () => {
      it('editar deve falhar porque não foi implementado', async () => {
         try {
            await expect(repository.edit(categoriaProdutos[0]));
         } catch (error) {
            expect(error.message).toEqual('Método não implementado.');
         }
      });
   });

   describe('delete', () => {
      it('deletar deve falhar porque não foi implementado', async () => {
         try {
            await expect(repository.delete(1));
         } catch (error) {
            expect(error.message).toEqual('Método não implementado.');
         }
      });
   });

   describe('findAll', () => {
      it('deve retornar uma lista de categorias', async () => {
         const categorias = await repository.findAll();
         expect(categorias).toEqual(categoriaProdutos);
      });

      it('não deve retornar lista de categorias quando houver um erro de banco ', async () => {
         const error = new TypeORMError('Erro genérico do TypeORM');
         jest.spyOn(repositoryTypeOrm, 'find').mockRejectedValue(error);

         // verifica se foi lançada uma exception na camada infra
         await expect(repository.findAll()).rejects.toThrowError(RepositoryException);
      }); // end it não deve retornar lista de categorias quando houver um erro de banco
   });
});
