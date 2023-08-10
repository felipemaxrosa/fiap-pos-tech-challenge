import { Repository, TypeORMError } from 'typeorm';
import { Test, TestingModule } from '@nestjs/testing';

import { ItemPedidoConstants } from '../../../../shared/constants';
import { IRepository } from '../../../../domain/repository/repository';
import { ItemPedido } from '../../../../domain/item-pedido/model/item-pedido.model';
import { RepositoryException } from '../../../../infrastructure/exception/repository.exception';

import { ItemPedidoEntity } from '../entity/item-pedido.entity';
import { ItemPedidoTypeormRepository } from './item-pedido-typeorm.repository';

describe('ItemPedidoTypeormRepository', () => {
   let repository: IRepository<ItemPedido>;
   let repositoryTypeOrm: Repository<ItemPedidoEntity>;

   const { IREPOSITORY, REPOSITORY_ENTITY } = ItemPedidoConstants;

   const mockedItemPedido: ItemPedido = {
      pedidoId: 1,
      produtoId: 1,
      quantidade: 1,
   };

   const itemPedidoEntity: ItemPedidoEntity = {
      id: 1,
      pedidoId: 1,
      produtoId: 1,
      quantidade: 1,
   };

   beforeEach(async () => {
      // Configuração do módulo de teste
      const module: TestingModule = await Test.createTestingModule({
         providers: [
            //  IRepository<Pedido> provider
            {
               provide: IREPOSITORY,
               inject: [REPOSITORY_ENTITY],
               useFactory: (repositoryTypeOrm: Repository<ItemPedidoEntity>): IRepository<ItemPedido> => {
                  return new ItemPedidoTypeormRepository(repositoryTypeOrm);
               },
            },
            // Mock do serviço Repository<PedidoEntity>
            {
               provide: REPOSITORY_ENTITY,
               useValue: {
                  save: jest.fn(),
                  findBy: jest.fn(),
                  edit: jest.fn(),
                  delete: jest.fn(),
                  update: jest.fn(),
               },
            },
         ],
      }).compile();

      // Desabilita a saída de log
      module.useLogger(false);

      // Obtém a instância dos repositórios
      repository = module.get<IRepository<ItemPedido>>(IREPOSITORY);
      repositoryTypeOrm = module.get<Repository<ItemPedidoEntity>>(REPOSITORY_ENTITY);
   });

   describe('Injeção de dependências', () => {
      it('deve existir instâncias de repositório type orm definida', async () => {
         expect(repositoryTypeOrm).toBeDefined();
      });
   });

   describe('save', () => {
      it('deve CRIAR novo item do pedido', async () => {
         const repositorySaveSpy = jest.spyOn(repositoryTypeOrm, 'save').mockResolvedValue(itemPedidoEntity);

         await repository.save(mockedItemPedido).then((itemSalvo) => {
            // verifica se o pedido criado contém os mesmos dados passados como input
            expect(itemSalvo.id).toEqual(1);
            expect(itemSalvo.pedidoId).toEqual(mockedItemPedido.pedidoId);
            expect(itemSalvo.produtoId).toEqual(mockedItemPedido.produtoId);
            expect(itemSalvo.quantidade).toEqual(mockedItemPedido.quantidade);
         });

         expect(repositorySaveSpy).toBeCalled();
      });

      it('NAO DEVE CRIAR novo item do pedido quando houver um erro de banco ', async () => {
         const error = new TypeORMError('Erro genérico do TypeORM');
         jest.spyOn(repositoryTypeOrm, 'save').mockRejectedValue(error);

         // verifiaca se foi lançada uma exception na camada infra
         await expect(repository.save(mockedItemPedido)).rejects.toThrowError(RepositoryException);
      });
   });

   describe('findBy', () => {
      it('deve buscar o item do pedido pelo id', async () => {
         repositoryTypeOrm.findBy = jest.fn().mockImplementation((attributes: Partial<ItemPedido>) => {
            return Promise.resolve(attributes['id'] === mockedItemPedido.id ? [itemPedidoEntity] : {});
         });

         await repository.findBy({ id: mockedItemPedido.id }).then((itemsPedido) => {
            // verifica se os pedidos encontrados contém os mesmos dados passados como input
            itemsPedido.forEach((item) => {
               expect(item.id).toEqual(itemPedidoEntity.id);
               expect(item.pedidoId).not.toBeUndefined();
               expect(item.produtoId).not.toBeUndefined();
               expect(item.quantidade).not.toBeUndefined();
            });
         });
      });

      it('não deve buscar item do pedido quando houver um erro de banco ', async () => {
         const error = new TypeORMError('Erro genérico do TypeORM');
         jest.spyOn(repositoryTypeOrm, 'findBy').mockRejectedValue(error);

         // verifiaca se foi lançada uma exception na camada infra
         await expect(repository.findBy({})).rejects.toThrowError(RepositoryException);
      });
   });

   describe('edit', () => {
      it('deve editar item do pedido corretamente', async () => {
         const itemPedidoEditarEntity: ItemPedidoEntity = {
            ...itemPedidoEntity,
            quantidade: 3,
         };

         const typeOrmEdicaoReturn = { generatedMaps: [], raw: [], affected: 1 };

         const repositorySaveSpy = jest.spyOn(repositoryTypeOrm, 'update').mockResolvedValue(typeOrmEdicaoReturn);

         await repository.edit(itemPedidoEditarEntity).then((pedidoEditado) => {
            expect(pedidoEditado.quantidade).toEqual(3);
         });

         expect(repositorySaveSpy).toBeCalled();
      });

      it('não deve editar item do pedido quando houver um erro de banco ', async () => {
         const error = new TypeORMError('Erro genérico do TypeORM');
         jest.spyOn(repositoryTypeOrm, 'update').mockRejectedValue(error);

         // verifica se foi lançada uma exception na camada infra
         await expect(repository.edit(mockedItemPedido)).rejects.toThrowError(RepositoryException);
      }); // end it não deve editar produto quando houver um erro de banco
   });

   describe('delete', () => {
      it('deve deletar pedido corretamente', async () => {
         jest.spyOn(repositoryTypeOrm, 'findBy').mockResolvedValue([itemPedidoEntity]);
         const repositorySpy = (repositoryTypeOrm.delete as jest.Mock).mockResolvedValue(true);

         await repository.delete(1).then((result) => {
            expect(result).toBeTruthy();
         });
         expect(repositorySpy).toBeCalled();
      });

      it('não deve deletar o item do pedido quando houver um erro de banco ', async () => {
         const error = new TypeORMError('Erro genérico do TypeORM');
         jest.spyOn(repositoryTypeOrm, 'findBy').mockResolvedValue([itemPedidoEntity]);
         jest.spyOn(repositoryTypeOrm, 'delete').mockRejectedValue(error);

         // verifica se foi lançada uma exception na camada infra
         await expect(repository.delete(1)).rejects.toThrowError(RepositoryException);
      });
   });

   describe('findAll', () => {
      it('findAll deve falhar porque não foi implementado', async () => {
         try {
            await expect(repository.findAll());
         } catch (error) {
            expect(error.message).toEqual('Método não implementado.');
         }
      });
   });
});
