import { Inject, Injectable, Logger } from '@nestjs/common';
import { ServiceException } from 'src/enterprise/exception/service.exception';
import { ItemPedido } from 'src/enterprise/item-pedido/model';
import { AddItemPedidoValidator, EditarItemPedidoValidator } from 'src/application/item-pedido/validation';
import { IRepository } from 'src/enterprise/repository/repository';
import { IService } from 'src/enterprise/service/service';
import { IValidator } from 'src/enterprise/validation/validator';
import { ItemPedidoConstants } from 'src/shared/constants';

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
