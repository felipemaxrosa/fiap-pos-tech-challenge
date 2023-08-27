import { Test, TestingModule } from '@nestjs/testing';
import { ServiceException } from 'src/enterprise/exception/service.exception';
import { ItemPedido } from 'src/enterprise/item-pedido/model';
import { AddItemPedidoValidator } from 'src/application/item-pedido/validation';
import { IRepository } from 'src/enterprise/repository/repository';
import { ItemPedidoConstants } from 'src/shared/constants';
import { PersistenceInMemoryProviders } from 'src/infrastructure/persistence/providers/persistence-in-memory.providers';
import { ItemPedidoProviders } from 'src/application/item-pedido/providers/item-pedido.providers';
import { SalvarItemPedidoUseCase } from 'src/application/item-pedido/usecase/salvar-item-pedido.usecase';

describe('SalvarItemPedidoUseCase', () => {
   let useCase: SalvarItemPedidoUseCase;
   let repository: IRepository<ItemPedido>;
   let adicionarValidators: AddItemPedidoValidator[];

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

      useCase = module.get<SalvarItemPedidoUseCase>(ItemPedidoConstants.SALVAR_ITEM_PEDIDO_USECASE);
      repository = module.get<IRepository<ItemPedido>>(ItemPedidoConstants.IREPOSITORY);
      adicionarValidators = module.get<AddItemPedidoValidator[]>(ItemPedidoConstants.ADD_ITEM_PEDIDO_VALIDATOR);
   });

   describe('salvarItemPedido', () => {
      it('deve salvar um item de pedido com sucesso', async () => {
         jest.spyOn(repository, 'save').mockResolvedValue(itemPedidoMock);

         const result = await useCase.salvarItemPedido(itemPedidoMock);

         expect(result).toEqual(itemPedidoMock);
      });

      it('deve lançar uma ServiceException em caso de erro no repositório', async () => {
         const error = new Error('Erro no repositório');
         jest.spyOn(repository, 'save').mockRejectedValue(error);

         await expect(useCase.salvarItemPedido(itemPedidoMock)).rejects.toThrowError(ServiceException);
      });

      it('deve executar os validadores antes de salvar o item de pedido', async () => {
         const mockValidator: AddItemPedidoValidator = {
            validate: jest.fn(),
         };

         jest.spyOn(repository, 'save').mockResolvedValue(itemPedidoMock);
         adicionarValidators.push(mockValidator);

         await useCase.salvarItemPedido(itemPedidoMock);

         expect(mockValidator.validate).toHaveBeenCalledWith(itemPedidoMock);
      });
   });
});
