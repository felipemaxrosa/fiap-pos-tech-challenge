import { Test, TestingModule } from '@nestjs/testing';
import { BuscarTodosPedidosNaoFinalizadosUseCase } from './buscar-todos-pedidos-nao-finalizados.usecase';
import { Pedido } from 'src/enterprise/pedido/model/pedido.model';
import { EstadoPedido } from 'src/enterprise/pedido/enums/pedido';
import { PedidoConstants } from 'src/shared/constants';
import { IRepository } from 'src/enterprise/repository/repository';
import { PedidoProviders } from 'src/application/pedido/providers/pedido.providers';
import { PersistenceInMemoryProviders } from 'src/infrastructure/persistence/providers/persistence-in-memory.providers';

describe('BuscarTodosPedidosNaoFinalizadosUseCase', () => {
   let useCase: BuscarTodosPedidosNaoFinalizadosUseCase;
   let repository: IRepository<Pedido>;

   const pedido1: Pedido = {
      id: 1,
      clienteId: 101,
      dataInicio: '2023-08-26',
      estadoPedido: EstadoPedido.RECEBIDO,
      ativo: true,
   };

   const pedido2: Pedido = {
      id: 2,
      clienteId: 102,
      dataInicio: '2023-08-27',
      estadoPedido: EstadoPedido.EM_PREPARACAO,
      ativo: true,
   };

   const pedido3: Pedido = {
      id: 3,
      clienteId: 102,
      dataInicio: '2023-08-28',
      estadoPedido: EstadoPedido.PRONTO,
      ativo: true,
   };

   beforeEach(async () => {
      const module: TestingModule = await Test.createTestingModule({
         providers: [
            ...PedidoProviders,
            ...PersistenceInMemoryProviders,
            // Mock do serviço IRepository<Pedido>
            {
               provide: PedidoConstants.IREPOSITORY,
               useValue: {
                  findAll: jest.fn(() => Promise.resolve([pedido1, pedido2, pedido3])),
               },
            },
         ],
      }).compile();

      useCase = module.get<BuscarTodosPedidosNaoFinalizadosUseCase>(PedidoConstants.BUSCAR_TODOS_PEDIDOS_NAO_FINALIZADOS_USECASE);
      repository = module.get<IRepository<Pedido>>(PedidoConstants.IREPOSITORY);
   });

   it('deve buscar todos os pedidos não finalizados ordenados por estado', async () => {

      const resultado = await useCase.buscarTodosPedidos();

      expect(resultado).toEqual([pedido3, pedido2, pedido1]);
   });
});
