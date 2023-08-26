import { Inject, Injectable, Logger } from '@nestjs/common';
import { ServiceException } from 'src/enterprise/exception/service.exception';
import { ItemPedido } from 'src/enterprise/item-pedido/model';
import { AddItemPedidoValidator } from 'src/application/item-pedido/validation';
import { IRepository } from 'src/enterprise/repository/repository';
import { ItemPedidoConstants } from 'src/shared/constants';
import { ValidatorUtils } from 'src/shared/validator.utils';

@Injectable()
export class SalvarItemPedidoUseCase {
   private logger = new Logger(SalvarItemPedidoUseCase.name);

   constructor(
      @Inject(ItemPedidoConstants.IREPOSITORY) private repository: IRepository<ItemPedido>,
      @Inject(ItemPedidoConstants.ADD_ITEM_PEDIDO_VALIDATOR)
      private adicionarValidators: AddItemPedidoValidator[],
   ) {}

   async salvarItemPedido(item: ItemPedido): Promise<ItemPedido> {
      await ValidatorUtils.executeValidators(this.adicionarValidators, item);

      return await this.repository.save(item).catch((error) => {
         this.logger.error(`Erro ao salvar no banco de dados: ${error} `);
         throw new ServiceException(
            `Houve um erro ao adicionar o produto: ${item.produtoId} ao pedido: ${item.pedidoId} - ${error}`,
         );
      });
   }
}
