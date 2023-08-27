import { Test, TestingModule } from '@nestjs/testing';
import { BuscarItensPorPedidoIdUseCase } from './buscar-itens-por-pedido-id.usecase';
import { ServiceException } from 'src/enterprise/exception/service.exception';
import { ItemPedido } from 'src/enterprise/item-pedido/model';
import { IRepository } from 'src/enterprise/repository/repository';
import { ItemPedidoConstants, PedidoConstants } from 'src/shared/constants';
import { ItemPedidoProviders } from 'src/application/item-pedido/providers/item-pedido.providers';
import { PersistenceInMemoryProviders } from 'src/infrastructure/persistence/providers/persistence-in-memory.providers';
import { PedidoProviders } from 'src/application/pedido/providers/pedido.providers';

describe('BuscarItensPorPedidoIdUseCase', () => {
   let useCase: BuscarItensPorPedidoIdUseCase;
   let repository: IRepository<ItemPedido>;

   const pedidoId = 123;
   const itensPedidoMock: ItemPedido[] = [
      { pedidoId, produtoId: 1, quantidade: 2, id: 1 },
      { pedidoId, produtoId: 2, quantidade: 1, id: 2 },
   ];

   beforeEach(async () => {
      const module: TestingModule = await Test.createTestingModule({
         providers: [...ItemPedidoProviders, ...PedidoProviders, ...PersistenceInMemoryProviders],
      }).compile();

      // Desabilita a saída de log
      module.useLogger(false);

      useCase = module.get<BuscarItensPorPedidoIdUseCase>(PedidoConstants.BUSCAR_ITENS_PEDIDO_POR_PEDIDO_ID_USECASE);
      repository = module.get<IRepository<ItemPedido>>(ItemPedidoConstants.IREPOSITORY);
   });

   describe('buscarItensPedidoPorPedidoId', () => {
      it('deve buscar os itens de um pedido por ID com sucesso', async () => {
         jest.spyOn(repository, 'findBy').mockResolvedValue(itensPedidoMock);

         const result = await useCase.buscarItensPedidoPorPedidoId(pedidoId);

         expect(result).toEqual(itensPedidoMock);
      });

      it('deve lançar uma ServiceException em caso de erro no repositório', async () => {
         const error = new Error('Erro no repositório');
         jest.spyOn(repository, 'findBy').mockRejectedValue(error);

         await expect(useCase.buscarItensPedidoPorPedidoId(pedidoId)).rejects.toThrowError(ServiceException);
      });
   });
});
