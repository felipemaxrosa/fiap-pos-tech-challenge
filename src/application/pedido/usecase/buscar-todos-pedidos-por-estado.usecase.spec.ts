import { Test, TestingModule } from '@nestjs/testing';
import { BuscarTodosPedidosPorEstadoUseCase } from './buscar-todos-pedidos-por-estado.usecase';
import { ServiceException } from 'src/enterprise/exception/service.exception';
import { Pedido } from 'src/enterprise/pedido/model/pedido.model';
import { IPedidoRepository } from 'src/enterprise/pedido/repository/pedido.repository.interface';
import { PedidoConstants } from 'src/shared/constants';
import { PedidoProviders } from 'src/application/pedido/providers/pedido.providers';
import { PersistenceInMemoryProviders } from 'src/infrastructure/persistence/providers/persistence-in-memory.providers';
import { EstadoPedido } from 'src/enterprise/pedido/enums/pedido';

describe('BuscarTodosPedidosPorEstadoUseCase', () => {
   let useCase: BuscarTodosPedidosPorEstadoUseCase;
   let repository: IPedidoRepository;

   const pedidoEmPreparo1: Pedido = {
      id: 1,
      clienteId: 101,
      dataInicio: '2023-08-26',
      estadoPedido: EstadoPedido.EM_PREPARO,
      ativo: true,
      total: 50.0,
   };

   const pedidoEmPreparo2: Pedido = {
      id: 2,
      clienteId: 102,
      dataInicio: '2023-08-26',
      estadoPedido: EstadoPedido.EM_PREPARO,
      ativo: true,
      total: 75.0,
   };

   const pedidosEmPreparoMock: Pedido[] = [pedidoEmPreparo1, pedidoEmPreparo2];

   beforeEach(async () => {
      const module: TestingModule = await Test.createTestingModule({
         providers: [...PedidoProviders, ...PersistenceInMemoryProviders],
      }).compile();

      // Desabilita a saída de log
      module.useLogger(false);

      useCase = module.get<BuscarTodosPedidosPorEstadoUseCase>(PedidoConstants.BUSCAR_TODOS_PEDIDOS_POR_ESTADO_USECASE);
      repository = module.get<IPedidoRepository>(PedidoConstants.IREPOSITORY);
   });

   describe('buscarTodosPedidosPorEstado', () => {
      it('deve buscar todos os pedidos por estado com sucesso', async () => {
         jest.spyOn(repository, 'findBy').mockResolvedValue(pedidosEmPreparoMock);

         const result = await useCase.buscarTodosPedidosPorEstado(EstadoPedido.EM_PREPARO);

         expect(result).toEqual(pedidosEmPreparoMock);
      });

      it('deve lançar uma ServiceException em caso de erro no repositório', async () => {
         const error = new Error('Erro no repositório');
         jest.spyOn(repository, 'findBy').mockRejectedValue(error);

         await expect(useCase.buscarTodosPedidosPorEstado(EstadoPedido.EM_PREPARO)).rejects.toThrowError(
            ServiceException,
         );
      });
   });
});
