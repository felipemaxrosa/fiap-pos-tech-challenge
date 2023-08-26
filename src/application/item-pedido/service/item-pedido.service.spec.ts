import { Test, TestingModule } from '@nestjs/testing';
import { ItemPedidoService } from 'src/application/item-pedido/service/item-pedido.service';
import { ServiceException } from 'src/enterprise/exception/service.exception';
import { ValidationException } from 'src/enterprise/exception/validation.exception';
import { ItemPedido } from 'src/enterprise/item-pedido/model';
import {
   AddItemPedidoValidator,
   EditarItemPedidoValidator,
   QuantidadeMinimaItemValidator,
   ItemPedidoExistenteValidator,
} from 'src/application/item-pedido/validation';
import { IRepository } from 'src/enterprise/repository/repository';
import { RepositoryException } from 'src/infrastructure/exception/repository.exception';
import { SalvarItemPedidoRequest } from 'src/presentation/rest/item-pedido/request';
import { ItemPedidoConstants } from 'src/shared/constants';
import { IItemPedidoService } from 'src/application/item-pedido/service/item-pedido.service.interface';
import { DeletarItemPedidoUseCase } from 'src/application/item-pedido/usecase/deletar-item-pedido.usecase';
import { EditarItemPedidoUseCase } from 'src/application/item-pedido/usecase/editar-item-pedido.usecase';
import { SalvarItemPedidoUseCase } from 'src/application/item-pedido/usecase/salvar-item-pedido.usecase';

describe('ItemPedidoService', () => {
   let service: IItemPedidoService;
   let repository: IRepository<ItemPedido>;
   let validators: AddItemPedidoValidator[];

   const itemPedido: ItemPedido = {
      id: 1,
      pedidoId: 1,
      produtoId: 1,
      quantidade: 1,
   };

   const itemPedidoEditado: ItemPedido = {
      id: 1,
      pedidoId: 1,
      produtoId: 1,
      quantidade: 10,
   };

   beforeEach(async () => {
      // Configuração do módulo de teste
      const module: TestingModule = await Test.createTestingModule({
         providers: [
            {
               provide: ItemPedidoConstants.ISERVICE,
               inject: [
                  ItemPedidoConstants.SALVAR_ITEM_PEDIDO_USECASE,
                  ItemPedidoConstants.EDITAR_ITEM_PEDIDO_USECASE,
                  ItemPedidoConstants.DELETAR_ITEM_PEDIDO_USECASE,
               ],
               useFactory: (
                  salvarUsecase: SalvarItemPedidoUseCase,
                  editarUsecase: EditarItemPedidoUseCase,
                  deletarUsecase: DeletarItemPedidoUseCase,
               ): IItemPedidoService => {
                  return new ItemPedidoService(salvarUsecase, editarUsecase, deletarUsecase);
               },
            },
            {
               provide: ItemPedidoConstants.IREPOSITORY,
               useValue: {
                  save: jest.fn(() => Promise.resolve(itemPedido)),
                  findBy: jest.fn(() => {
                     return Promise.resolve({});
                  }),
                  edit: jest.fn(() => Promise.resolve(itemPedidoEditado)),
                  delete: jest.fn(() => Promise.resolve(true)),
               },
            },
            {
               provide: ItemPedidoConstants.ADD_ITEM_PEDIDO_VALIDATOR,
               inject: [ItemPedidoConstants.IREPOSITORY],
               useFactory: (): AddItemPedidoValidator[] => {
                  return [new QuantidadeMinimaItemValidator()];
               },
            },
            {
               provide: ItemPedidoConstants.EDITAR_ITEM_PEDIDO_VALIDATOR,
               inject: [ItemPedidoConstants.IREPOSITORY],
               useFactory: (repository: IRepository<ItemPedido>): EditarItemPedidoValidator[] => {
                  return [new ItemPedidoExistenteValidator(repository)];
               },
            },
            {
               provide: ItemPedidoConstants.SALVAR_ITEM_PEDIDO_USECASE,
               inject: [ItemPedidoConstants.IREPOSITORY, ItemPedidoConstants.ADD_ITEM_PEDIDO_VALIDATOR],
               useFactory: (
                  repository: IRepository<ItemPedido>,
                  validators: AddItemPedidoValidator[],
               ): SalvarItemPedidoUseCase => new SalvarItemPedidoUseCase(repository, validators),
            },
            {
               provide: ItemPedidoConstants.EDITAR_ITEM_PEDIDO_USECASE,
               inject: [
                  ItemPedidoConstants.IREPOSITORY,
                  ItemPedidoConstants.ADD_ITEM_PEDIDO_VALIDATOR,
                  ItemPedidoConstants.EDITAR_ITEM_PEDIDO_VALIDATOR,
               ],
               useFactory: (
                  repository: IRepository<ItemPedido>,
                  adicionarValidators: AddItemPedidoValidator[],
                  editarValidators: EditarItemPedidoValidator[],
               ): EditarItemPedidoUseCase =>
                  new EditarItemPedidoUseCase(repository, adicionarValidators, editarValidators),
            },
            {
               provide: ItemPedidoConstants.DELETAR_ITEM_PEDIDO_USECASE,
               inject: [ItemPedidoConstants.IREPOSITORY],
               useFactory: (repository: IRepository<ItemPedido>): DeletarItemPedidoUseCase =>
                  new DeletarItemPedidoUseCase(repository),
            },
         ],
      }).compile();

      module.useLogger(false);

      repository = module.get<IRepository<ItemPedido>>(ItemPedidoConstants.IREPOSITORY);
      validators = module.get<AddItemPedidoValidator[]>(ItemPedidoConstants.ADD_ITEM_PEDIDO_VALIDATOR);
      service = module.get<IItemPedidoService>(ItemPedidoConstants.ISERVICE);
   });

   describe('injeção de dependências', () => {
      it('deve existir instância de repositório definida', async () => {
         expect(repository).toBeDefined();
         expect(validators).toBeDefined();
      });
   });

   describe('save', () => {
      it('deve ADICIONAR item ao pedido', async () => {
         const novoItem: SalvarItemPedidoRequest = {
            pedidoId: 1,
            produtoId: 1,
            quantidade: 1,
         };

         await service.save(novoItem).then((itemAdicionado) => {
            expect(itemAdicionado.id).toEqual(1);
            expect;
         });
      });

      it('nao deve ADICIONAR item ao pedido com quantidade igual a zero', async () => {
         await expect(service.save({ ...itemPedido, quantidade: 0 })).rejects.toThrowError(
            QuantidadeMinimaItemValidator.ERROR_MESSAGE,
         );
      });

      it('nao deve adicionar um item ao pedido quando houver erro de banco', async () => {
         const error = new RepositoryException('Erro genérico de banco de dados');
         jest.spyOn(repository, 'save').mockRejectedValue(error);

         // verifiaca se foi lançada uma exception na camada de serviço
         await expect(service.save(itemPedido)).rejects.toThrowError(ServiceException);
      });
   });

   describe('edit', () => {
      it('deve EDITAR o produto', async () => {
         jest.spyOn(repository, 'findBy').mockResolvedValue([itemPedido]);

         await service.edit({ ...itemPedido, quantidade: 10 }).then((itemAdicionado) => {
            expect(itemAdicionado.quantidade).toEqual(10);
         });
      });

      it('nao deve EDITAR item quando item nao existir', async () => {
         jest.spyOn(repository, 'findBy').mockResolvedValue([]);

         const error = new RepositoryException('Erro genérico de banco de dados');
         jest.spyOn(repository, 'edit').mockRejectedValue(error);

         await expect(service.edit(itemPedido)).rejects.toThrowError(ValidationException);
      });

      it('nao deve EDITAR item quanto houver erro de banco', async () => {
         jest.spyOn(repository, 'findBy').mockResolvedValue([itemPedido]);

         const error = new RepositoryException('Erro genérico de banco de dados');
         jest.spyOn(repository, 'edit').mockRejectedValue(error);

         // verifiaca se foi lançada uma exception na camada de serviço
         await expect(service.edit(itemPedido)).rejects.toThrowError(ServiceException);
      });
   });

   describe('delete', () => {
      it('deletar deve falhar porque não foi implementado', async () => {
         await service.delete(itemPedido.id).then((result) => expect(result).toBeTruthy());
      });

      it('nao deve deletar item quanto houver erro de banco', async () => {
         const error = new RepositoryException('Erro genérico de banco de dados');
         jest.spyOn(repository, 'delete').mockRejectedValue(error);

         await expect(service.delete(itemPedido.id)).rejects.toThrowError(ServiceException);
      });
   });
});
