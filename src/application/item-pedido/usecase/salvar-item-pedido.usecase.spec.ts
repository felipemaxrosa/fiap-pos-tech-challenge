import { Test, TestingModule } from '@nestjs/testing';
import { ServiceException } from 'src/enterprise/exception/service.exception';
import { ItemPedido } from 'src/enterprise/item-pedido/model';
import { Pedido } from 'src/enterprise/pedido/model/pedido.model';
import { Produto } from 'src/enterprise/produto/model/produto.model';
import { AddItemPedidoValidator } from 'src/application/item-pedido/validation';
import { IRepository } from 'src/enterprise/repository/repository';
import { ItemPedidoConstants, PedidoConstants, ProdutoConstants } from 'src/shared/constants';
import { PersistenceInMemoryProviders } from 'src/infrastructure/persistence/providers/persistence-in-memory.providers';
import { ItemPedidoProviders } from 'src/application/item-pedido/providers/item-pedido.providers';
import { SalvarItemPedidoUseCase } from 'src/application/item-pedido/usecase/salvar-item-pedido.usecase';
import { EstadoPedido } from 'src/enterprise/pedido/enum/estado-pedido.enum';

describe('SalvarItemPedidoUseCase', () => {
   let useCase: SalvarItemPedidoUseCase;
   let repository: IRepository<ItemPedido>;
   let pedidoRepository: IRepository<Pedido>;
   let produtoRepository: IRepository<Produto>;
   let adicionarValidators: AddItemPedidoValidator[];

   const produto: Produto = {
      id: 1,
      nome: 'nome correto',
      idCategoriaProduto: 1,
      descricao: 'Teste',
      preco: 10,
      imagemBase64: '',
      ativo: true,
   };

   const pedido: Pedido = {
      id: 1,
      clienteId: 1,
      dataInicio: '2023-06-18',
      estadoPedido: EstadoPedido.PAGAMENTO_PENDENTE,
      ativo: true,
      total: 10,
   };

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
      pedidoRepository = module.get<IRepository<Pedido>>(PedidoConstants.IREPOSITORY);
      produtoRepository = module.get<IRepository<Produto>>(ProdutoConstants.IREPOSITORY);
      adicionarValidators = module.get<AddItemPedidoValidator[]>(ItemPedidoConstants.ADD_ITEM_PEDIDO_VALIDATOR);

      jest.spyOn(pedidoRepository, 'findBy').mockResolvedValue([pedido]);
      jest.spyOn(produtoRepository, 'findBy').mockResolvedValue([produto]);
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
