import { Injectable, Logger } from '@nestjs/common';

import { ValidationException } from 'src/domain/exception/validation.exception';
import { AddItemPedidoValidator } from './add-item-pedido.validator';
import { ItemPedido } from '../model/item-pedido.model';

@Injectable()
export class QuantidadeMinimaItemValidator implements AddItemPedidoValidator {
   public static ERROR_MESSAGE = 'A quantidade minima para adicionar um produto deve ser maio que zero';

   private logger = new Logger(QuantidadeMinimaItemValidator.name);

   async validate({ quantidade, pedidoId, produtoId }: ItemPedido): Promise<boolean> {
      this.logger.log(
         `Inicializando validação ${QuantidadeMinimaItemValidator.name} para adicionar um item ao pedido.`,
      );

      if (quantidade > 0) {
         this.logger.debug(
            `${QuantidadeMinimaItemValidator.name} finalizado com sucesso para adicionar novo item: ${produtoId} ao pedido: ${pedidoId}`,
         );

         return true;
      }

      this.logger.error(`Quantidade minima de um novo item invalida: ${quantidade}`);
      throw new ValidationException(QuantidadeMinimaItemValidator.ERROR_MESSAGE);
   }
}
