import { Test, TestingModule } from '@nestjs/testing';
import { PagamentoProviders } from 'src/application/pagamento/providers/pagamento.providers';
import { PedidoProviders } from 'src/application/pedido/providers/pedido.providers';
import { ServiceException } from 'src/enterprise/exception/service.exception';
import { EstadoPedido } from 'src/enterprise/pedido/enum/estado-pedido.enum';
import { IPedidoRepository } from 'src/enterprise/pedido/repository/pedido.repository.interface';
import { PersistenceInMemoryProviders } from 'src/infrastructure/persistence/providers/persistence-in-memory.providers';
import { PedidoConstants } from 'src/shared/constants';
import { BuscarEstadoPedidoPorIdUseCase } from './buscar-estado-pedido-por-id.usecase';

describe('BuscarEstadoPedidoPorIdUseCase', () => {
   let useCase: BuscarEstadoPedidoPorIdUseCase;
   let repository: IPedidoRepository;

   const pedidoMock = {
      clienteId: 1,
      dataInicio: '2023-08-26',
      estadoPedido: EstadoPedido.RECEBIDO,
      ativo: true,
      id: 123,
      total: 50.0,
   };

   beforeEach(async () => {
      const module: TestingModule = await Test.createTestingModule({
         providers: [...PedidoProviders, ...PagamentoProviders, ...PersistenceInMemoryProviders],
      }).compile();

      // Desabilita a saída de log
      module.useLogger(false);

      useCase = module.get<BuscarEstadoPedidoPorIdUseCase>(PedidoConstants.BUSCAR_ESTADO_PEDIDO_POR_ID_USECASE);
      repository = module.get<IPedidoRepository>(PedidoConstants.IREPOSITORY);
   });

   describe('buscarEstadoPedidoPorId', () => {
      it('deve buscar o estado de um pedido por ID com sucesso', async () => {
         jest.spyOn(repository, 'findBy').mockResolvedValue([pedidoMock]);

         const result = await useCase.buscarEstadoPedidoPorId(pedidoMock.id);

         expect(result).toEqual({ estadoPedido: pedidoMock.estadoPedido });
      });

      it('deve retornar undefined quando o pedido não for encontrado', async () => {
         jest.spyOn(repository, 'findBy').mockResolvedValue([]);

         const result = await useCase.buscarEstadoPedidoPorId(pedidoMock.id);

         expect(result).toBeUndefined();
      });

      it('deve lançar uma ServiceException em caso de erro no repositório', async () => {
         const error = new Error('Erro no repositório');
         jest.spyOn(repository, 'findBy').mockRejectedValue(error);

         await expect(useCase.buscarEstadoPedidoPorId(pedidoMock.id)).rejects.toThrowError(ServiceException);
      });
   });
});
