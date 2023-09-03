import { Test, TestingModule } from '@nestjs/testing';
import { ServiceException } from 'src/enterprise/exception/service.exception';
import { ValidationException } from 'src/enterprise/exception/validation.exception';
import { ItemPedido } from 'src/enterprise/item-pedido/model';
import { AddItemPedidoValidator, QuantidadeMinimaItemValidator } from 'src/application/item-pedido/validation';
import { IRepository } from 'src/enterprise/repository/repository';
import { RepositoryException } from 'src/infrastructure/exception/repository.exception';
import { SalvarItemPedidoRequest } from 'src/presentation/rest/item-pedido';
import { ItemPedidoConstants } from 'src/shared/constants';
import { IItemPedidoService } from 'src/application/item-pedido/service/item-pedido.service.interface';
import { ItemPedidoProviders } from 'src/application/item-pedido/providers/item-pedido.providers';
import { PersistenceInMemoryProviders } from 'src/infrastructure/persistence/providers/persistence-in-memory.providers';

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

   beforeEach(async () => {
      // Configuração do módulo de teste
      const module: TestingModule = await Test.createTestingModule({
         providers: [...ItemPedidoProviders, ...PersistenceInMemoryProviders],
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
