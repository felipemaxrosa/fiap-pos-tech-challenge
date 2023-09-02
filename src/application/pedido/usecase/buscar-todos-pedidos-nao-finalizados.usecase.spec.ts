import { Test, TestingModule } from '@nestjs/testing';
import { PagamentoProviders } from 'src/application/pagamento/providers/pagamento.providers';
import { PedidoProviders } from 'src/application/pedido/providers/pedido.providers';
import { EstadoPedido } from 'src/enterprise/pedido/enums/pedido';
import { Pedido } from 'src/enterprise/pedido/model/pedido.model';
import { IRepository } from 'src/enterprise/repository/repository';
import { PersistenceInMemoryProviders } from 'src/infrastructure/persistence/providers/persistence-in-memory.providers';
import { PedidoConstants } from 'src/shared/constants';
import { BuscarTodosPedidosNaoFinalizadosUseCase } from './buscar-todos-pedidos-nao-finalizados.usecase';

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
            ...PagamentoProviders,
            ...PersistenceInMemoryProviders,
            // Mock do serviço IRepository<Pedido>
            {
               provide: PedidoConstants.IREPOSITORY,
               useValue: {
                  find: jest.fn(() => Promise.resolve([pedido3, pedido2, pedido1])),
               },
            },
         ],
      }).compile();

      useCase = module.get<BuscarTodosPedidosNaoFinalizadosUseCase>(
         PedidoConstants.BUSCAR_TODOS_PEDIDOS_NAO_FINALIZADOS_USECASE,
      );
      repository = module.get<IRepository<Pedido>>(PedidoConstants.IREPOSITORY);
   });

   it('deve existir instância de repositório definida', async () => {
      expect(repository).toBeDefined();
   });

   it('deve buscar todos os pedidos não finalizados ordenados por estado', async () => {
      const resultado = await useCase.buscarTodosPedidos();

      expect(resultado).toEqual([pedido3, pedido2, pedido1]);
   });
});
