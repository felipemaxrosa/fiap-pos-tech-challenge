import { Test, TestingModule } from '@nestjs/testing';
import { DeletarItemPedidoUseCase } from './deletar-item-pedido.usecase';
import { ServiceException } from 'src/enterprise/exception/service.exception';
import { ItemPedido } from 'src/enterprise/item-pedido/model';
import { IRepository } from 'src/enterprise/repository/repository';
import { ItemPedidoConstants } from 'src/shared/constants';
import { PersistenceInMemoryProviders } from 'src/infrastructure/persistence/providers/persistence-in-memory.providers';
import { ItemPedidoProviders } from 'src/application/item-pedido/providers/item-pedido.providers';

describe('DeletarItemPedidoUseCase', () => {
   let useCase: DeletarItemPedidoUseCase;
   let repository: IRepository<ItemPedido>;

   const itemPedidoMock: ItemPedido = {
      pedidoId: 1,
      produtoId: 2,
      quantidade: 3,
      id: 123,
   };

   beforeEach(async () => {
      const module: TestingModule = await Test.createTestingModule({
         providers: [...ItemPedidoProviders, ...PersistenceInMemoryProviders],
      }).compile();

      // Desabilita a saída de log
      module.useLogger(false);

      useCase = module.get<DeletarItemPedidoUseCase>(ItemPedidoConstants.DELETAR_ITEM_PEDIDO_USECASE);
      repository = module.get<IRepository<ItemPedido>>(ItemPedidoConstants.IREPOSITORY);
   });

   describe('deletarItemPedido', () => {
      it('deve deletar um item de pedido com sucesso', async () => {
         jest.spyOn(repository, 'delete').mockResolvedValue(true);

         const result = await useCase.deletarItemPedido(itemPedidoMock.id);

         expect(result).toBeTruthy();
      });

      it('deve lançar uma ServiceException em caso de erro no repositório', async () => {
         const error = new Error('Erro no repositório');
         jest.spyOn(repository, 'delete').mockRejectedValue(error);

         await expect(useCase.deletarItemPedido(itemPedidoMock.id)).rejects.toThrowError(ServiceException);
      });
   });
});
