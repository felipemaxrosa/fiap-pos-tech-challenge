import { Repository, TypeORMError } from 'typeorm';
import { Test, TestingModule } from '@nestjs/testing';

import { Pedido } from 'src/domain/pedido/model/pedido.model';
import { IRepository } from 'src/domain/repository/repository';
import { PedidoEntity } from '../entity/pedido.entity';
import { PedidoTypeormRepository } from './pedido-typeorm.repository';
import { RepositoryException } from 'src/infrastructure/exception/repository.exception';
import { ESTADO_PEDIDO } from 'src/domain/pedido/enums/pedido';
import { PedidoConstants } from 'src/shared/constants';

describe('PedidoTypeormRepository', () => {
   let repository: IRepository<Pedido>;
   let repositoryTypeOrm: Repository<PedidoEntity>;

   const mockedPedido: Pedido = {
      id: 1,
      clienteId: 1,
      dataInicio: '2023-06-18',
      estadoPedido: ESTADO_PEDIDO.EM_PREPARO,
   };

   const pedidoEntity: PedidoEntity = {
      id: 1,
      clienteId: 1,
      dataInicio: '2023-06-18',
      estadoPedido: ESTADO_PEDIDO.EM_PREPARO,
   };

   beforeEach(async () => {
      // Configuração do módulo de teste
      const module: TestingModule = await Test.createTestingModule({
         providers: [
            //  IRepository<Pedido> provider
            {
               provide: PedidoConstants.IREPOSITORY,
               inject: [PedidoConstants.REPOSITORY_PEDIDO_ENTITY],
               useFactory: (repositoryTypeOrm: Repository<PedidoEntity>): IRepository<Pedido> => {
                  return new PedidoTypeormRepository(repositoryTypeOrm);
               },
            },
            // Mock do serviço Repository<PedidoEntity>
            {
               provide: PedidoConstants.REPOSITORY_PEDIDO_ENTITY,
               useValue: {
                  // mock para a chamama repositoryTypeOrm.save(cliente)
                  save: jest.fn(() => Promise.resolve(pedidoEntity)),
                  // mock para a chamama repositoryTypeOrm.findBy(attributes)
                  findBy: jest.fn(() => {
                     return Promise.resolve([pedidoEntity]);
                  }),
               },
            },
         ],
      }).compile();

      // Desabilita a saída de log
      module.useLogger(false);

      // Obtém a instância dos repositórios
      repository = module.get<IRepository<Pedido>>(PedidoConstants.IREPOSITORY);
      repositoryTypeOrm = module.get<Repository<PedidoEntity>>(PedidoConstants.REPOSITORY_PEDIDO_ENTITY);
   });

   describe('injeção de dependências', () => {
      it('deve existir instâncias de repositório type orm definida', async () => {
         expect(repositoryTypeOrm).toBeDefined();
      });
   });

   describe('save', () => {
      it('deve CRIAR novo pedido', async () => {
         const repositorySaveSpy = jest.spyOn(repositoryTypeOrm, 'save');

         await repository.save(mockedPedido).then((pedidoSalvo) => {
            // verifica se o cliente salvo contém os mesmos dados passados como input
            expect(pedidoSalvo.id).toEqual(1);
            expect(pedidoSalvo.clienteId).toEqual(mockedPedido.clienteId);
            expect(pedidoSalvo.dataInicio).toEqual(mockedPedido.dataInicio);
            expect(pedidoSalvo.estadoPedido).toEqual(mockedPedido.estadoPedido);
         });

         expect(repositorySaveSpy).toBeCalled();
      });

      it('NAO DEVE CRIAR novo pedido quando houver um erro de banco ', async () => {
         const error = new TypeORMError('Erro genérico do TypeORM');
         jest.spyOn(repositoryTypeOrm, 'save').mockRejectedValue(error);

         // verifiaca se foi lançada uma exception na camada infra
         await expect(repository.save(mockedPedido)).rejects.toThrowError(RepositoryException);
      });
   });

   describe('findBy', () => {
      it('deve buscar pedido pelo id', async () => {
         repositoryTypeOrm.findBy = jest.fn().mockImplementation((attributes: Partial<Pedido>) => {
            return Promise.resolve(attributes['id'] === mockedPedido.id ? [pedidoEntity] : {});
         });

         await repository.findBy({ id: mockedPedido.id }).then((pedidosEncontrados) => {
            // verifica se os pedidos encontrados contém os mesmos dados passados como input
            pedidosEncontrados.forEach((pedido) => {
               expect(pedido.id).toEqual(mockedPedido.id);
               expect(pedido.clienteId).not.toBeUndefined();
               expect(pedido.dataInicio).not.toBeUndefined();
               expect(pedido.estadoPedido).not.toBeUndefined();
            });
         });
      });

      it('deve buscar pedidos pela data inicio', async () => {
         repositoryTypeOrm.findBy = jest.fn().mockImplementation((attributes: Partial<Pedido>) => {
            return Promise.resolve(attributes['dataInicio'] === mockedPedido.dataInicio ? [pedidoEntity] : {});
         });

         await repository.findBy({ dataInicio: mockedPedido.dataInicio }).then((pedidosEncontrados) => {
            // verifica se o cliente salvo contém os mesmos dados passados como input
            pedidosEncontrados.forEach((pedido) => {
               expect(pedido.dataInicio).toEqual(mockedPedido.dataInicio);
               expect(pedido.id).not.toBeUndefined();
               expect(pedido.clienteId).not.toBeUndefined();
               expect(pedido.estadoPedido).not.toBeUndefined();
            });
         });
      });

      it('deve buscar pedido pelo cliente ID', async () => {
         repositoryTypeOrm.findBy = jest.fn().mockImplementation((attributes: Partial<Pedido>) => {
            return Promise.resolve(attributes['clienteId'] === mockedPedido.clienteId ? [pedidoEntity] : {});
         });

         await repository.findBy({ clienteId: mockedPedido.clienteId }).then((pedidosEncontrados) => {
            // verifica se o cliente salvo contém os mesmos dados passados como input
            pedidosEncontrados.forEach((pedido) => {
               expect(pedido.clienteId).toEqual(mockedPedido.clienteId);
               expect(pedido.id).not.toBeUndefined();
               expect(pedido.dataInicio).not.toBeUndefined();
               expect(pedido.estadoPedido).not.toBeUndefined();
            });
         });
      });

      it('deve buscar pedido pelo estado', async () => {
         repositoryTypeOrm.findBy = jest.fn().mockImplementation((attributes: Partial<Pedido>) => {
            return Promise.resolve(attributes['estadoPedido'] === mockedPedido.estadoPedido ? [pedidoEntity] : {});
         });

         await repository.findBy({ estadoPedido: mockedPedido.estadoPedido }).then((pedidosEncontrados) => {
            // verifica se o cliente salvo contém os mesmos dados passados como input
            pedidosEncontrados.forEach((pedido) => {
               expect(pedido.estadoPedido).toEqual(mockedPedido.estadoPedido);
               expect(pedido.id).not.toBeUndefined();
               expect(pedido.dataInicio).not.toBeUndefined();
               expect(pedido.clienteId).not.toBeUndefined();
            });
         });
      });

      it('não deve criar novo pedido quando houver um erro de banco ', async () => {
         const error = new TypeORMError('Erro genérico do TypeORM');
         jest.spyOn(repositoryTypeOrm, 'findBy').mockRejectedValue(error);

         // verifiaca se foi lançada uma exception na camada infra
         await expect(repository.findBy({})).rejects.toThrowError(RepositoryException);
      });
   });
});
