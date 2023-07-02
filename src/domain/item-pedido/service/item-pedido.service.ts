import { Inject, Injectable, Logger } from '@nestjs/common';
import { IRepository } from 'src/domain/repository/repository';
import { IService } from 'src/domain/service/service';
import { ServiceException } from '../../exception/service.exception';
import { ItemPedido } from '../model/item-pedido.model';
import { ItemPedidoConstants } from 'src/shared/constants';
import { AddItemPedidoValidator } from '../validation/add-item-pedido.validator';

@Injectable()
export class ItemPedidoService implements IService<ItemPedido> {
   private logger = new Logger(ItemPedidoService.name);

   constructor(
      @Inject(ItemPedidoConstants.IREPOSITORY) private repository: IRepository<ItemPedido>,
      @Inject('AddItemPedidoValidator')
      private validators: AddItemPedidoValidator[],
   ) {}

   async save(item: ItemPedido): Promise<ItemPedido> {
      for (const validator of this.validators) {
         await validator.validate(item);
      }

      return await this.repository.save(item).catch((error) => {
         this.logger.error(`Erro ao salvar no banco de dados: ${error} `);
         throw new ServiceException(
            `Houve um erro ao adicionar o produto: ${item.produtoId} ao pedido: ${item.pedidoId} - ${error}`,
         );
      });
   }

   edit(): Promise<ItemPedido> {
      throw new ServiceException(`Método não implementado.`);
   }

   delete(): Promise<boolean> {
      throw new ServiceException('Método não implementado.');
   }

   findById(): Promise<ItemPedido> {
      throw new ServiceException('Método não implementado.');
   }
}
