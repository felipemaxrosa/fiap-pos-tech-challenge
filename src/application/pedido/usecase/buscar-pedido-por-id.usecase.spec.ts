import { Test, TestingModule } from '@nestjs/testing';
import { BuscarPedidoPorIdUseCase } from './buscar-pedido-por-id.usecase';
import { ServiceException } from 'src/enterprise/exception/service.exception';
import { Pedido } from 'src/enterprise/pedido/model/pedido.model';
import { IPedidoRepository } from 'src/enterprise/pedido/repository/pedido.repository.interface';
import { PedidoConstants } from 'src/shared/constants';
import { PedidoProviders } from 'src/application/pedido/providers/pedido.providers';
import { PersistenceInMemoryProviders } from 'src/infrastructure/persistence/providers/persistence-in-memory.providers';
import { EstadoPedido } from 'src/enterprise/pedido/enums/pedido';

describe('BuscarPedidoPorIdUseCase', () => {
   let useCase: BuscarPedidoPorIdUseCase;
   let repository: IPedidoRepository;

   const pedidoId = 123;
   const pedidoMock: Pedido = {
      id: pedidoId,
      clienteId: 456,
      dataInicio: '2023-08-26',
      estadoPedido: EstadoPedido.EM_PREPARACAO,
      ativo: true,
      total: 100.0,
   };

   beforeEach(async () => {
      const module: TestingModule = await Test.createTestingModule({
         providers: [...PedidoProviders, ...PersistenceInMemoryProviders],
      }).compile();

      // Desabilita a saída de log
      module.useLogger(false);

      useCase = module.get<BuscarPedidoPorIdUseCase>(PedidoConstants.BUSCAR_PEDIDO_POR_ID_USECASE);
      repository = module.get<IPedidoRepository>(PedidoConstants.IREPOSITORY);
   });

   describe('buscarPedidoPorId', () => {
      it('deve buscar um pedido por ID com sucesso', async () => {
         jest.spyOn(repository, 'findBy').mockResolvedValue([pedidoMock]);

         const result = await useCase.buscarPedidoPorId(pedidoId);

         expect(result).toEqual(pedidoMock);
      });

      it('deve lançar uma ServiceException em caso de erro no repositório', async () => {
         const error = new Error('Erro no repositório');
         jest.spyOn(repository, 'findBy').mockRejectedValue(error);

         await expect(useCase.buscarPedidoPorId(pedidoId)).rejects.toThrowError(ServiceException);
      });
   });
});
