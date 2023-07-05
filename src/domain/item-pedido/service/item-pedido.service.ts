import { Inject, Injectable, Logger } from '@nestjs/common';
import { IRepository } from 'src/domain/repository/repository';
import { IService } from 'src/domain/service/service';
import { ServiceException } from '../../exception/service.exception';
import { ItemPedido } from '../model/item-pedido.model';
import { ItemPedidoConstants } from 'src/shared/constants';
import { AddItemPedidoValidator, EditarItemPedidoValidator } from '../validation';
import { IValidator } from 'src/domain/validation/validator';

@Injectable()
export class ItemPedidoService implements IService<ItemPedido> {
   private logger = new Logger(ItemPedidoService.name);

   constructor(
      @Inject(ItemPedidoConstants.IREPOSITORY) private repository: IRepository<ItemPedido>,
      @Inject(ItemPedidoConstants.ADD_ITEM_PEDIDO_VALIDATOR)
      private adicionarValidators: AddItemPedidoValidator[],
      @Inject(ItemPedidoConstants.EDITAR_ITEM_PEDIDO_VALIDATOR)
      private editarValidators: EditarItemPedidoValidator[],
   ) {}

   async save(item: ItemPedido): Promise<ItemPedido> {
      await this.validate(this.adicionarValidators, item);

      return await this.repository.save(item).catch((error) => {
         this.logger.error(`Erro ao salvar no banco de dados: ${error} `);
         throw new ServiceException(
            `Houve um erro ao adicionar o produto: ${item.produtoId} ao pedido: ${item.pedidoId} - ${error}`,
         );
      });
   }

   async edit(item: ItemPedido): Promise<ItemPedido> {
      await this.validate(this.editarValidators, item);
      await this.validate(this.adicionarValidators, item);

      return await this.repository
         .edit(item)
         .then((itemEditado) => itemEditado)
         .catch((error) => {
            this.logger.error(`Erro ao salvar no banco de dados: ${error} `);
            throw new ServiceException(
               `Houve um erro ao editar o item: ${item.produtoId} ao pedido: ${item.pedidoId} - ${error}`,
            );
         });
   }

   async delete(id: number): Promise<boolean> {
      return await this.repository.delete(id).catch((error) => {
         this.logger.error(`Erro ao deletar no banco de dados: ${error} `);
         throw new ServiceException(`Houve um erro ao deletar o item do pedido: ${error}`);
      });
   }

   findById(): Promise<ItemPedido> {
      throw new ServiceException('Método não implementado.');
   }

   private async validate(validators: IValidator<ItemPedido>[], cliente: ItemPedido): Promise<void> {
      for (const validator of validators) {
         await validator.validate(cliente);
      }
   }
}
