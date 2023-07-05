import { Test, TestingModule } from '@nestjs/testing';

import { RepositoryException } from 'src/infrastructure/exception/repository.exception';
import { ServiceException } from 'src/domain/exception/service.exception';
import { IService } from 'src/domain/service/service';

import { ItemPedido } from '../model';
import { IRepository } from 'src/domain/repository/repository';
import { ItemPedidoService } from './item-pedido.service';
import { ItemPedidoConstants } from 'src/shared/constants';
import { SalvarItemPedidoRequest } from 'src/application/web/item-pedido/request';
import {
   AddItemPedidoValidator,
   EditarItemPedidoValidator,
   QuantidadeMinimaItemValidator,
   ItemPedidoExistenteValidator,
} from '../validation';
import { ValidationException } from 'src/domain/exception/validation.exception';

describe('ItemPedidoService', () => {
   let service: IService<ItemPedido>;
   let repository: IRepository<ItemPedido>;
   let validators: AddItemPedidoValidator[];

   const { ISERVICE, IREPOSITORY, ADD_ITEM_PEDIDO_VALIDATOR, EDITAR_ITEM_PEDIDO_VALIDATOR } = ItemPedidoConstants;

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
               provide: ISERVICE,
               inject: [IREPOSITORY, ADD_ITEM_PEDIDO_VALIDATOR, EDITAR_ITEM_PEDIDO_VALIDATOR],
               useFactory: (
                  repository: IRepository<ItemPedido>,
                  adicionarValidators: AddItemPedidoValidator[],
                  editarValidators: EditarItemPedidoValidator[],
               ): IService<ItemPedido> => {
                  return new ItemPedidoService(repository, adicionarValidators, editarValidators);
               },
            },
            {
               provide: IREPOSITORY,
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
               provide: ADD_ITEM_PEDIDO_VALIDATOR,
               inject: [IREPOSITORY],
               useFactory: (): AddItemPedidoValidator[] => {
                  return [new QuantidadeMinimaItemValidator()];
               },
            },
            {
               provide: EDITAR_ITEM_PEDIDO_VALIDATOR,
               inject: [IREPOSITORY],
               useFactory: (repository: IRepository<ItemPedido>): EditarItemPedidoValidator[] => {
                  return [new ItemPedidoExistenteValidator(repository)];
               },
            },
         ],
      }).compile();

      module.useLogger(false);

      repository = module.get<IRepository<ItemPedido>>(IREPOSITORY);
      validators = module.get<AddItemPedidoValidator[]>(ADD_ITEM_PEDIDO_VALIDATOR);
      service = module.get<IService<ItemPedido>>(ISERVICE);
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
   });

   describe('findById', () => {
      it('findById deve falhar porque não foi implementado', async () => {
         try {
            await expect(service.findById(1));
         } catch (error) {
            expect(error.message).toEqual('Método não implementado.');
         }
      });

      it('nao deve deletar item quanto houver erro de banco', async () => {
         const error = new RepositoryException('Erro genérico de banco de dados');
         jest.spyOn(repository, 'delete').mockRejectedValue(error);

         await expect(service.delete(itemPedido.id)).rejects.toThrowError(ServiceException);
      });
   });
});
