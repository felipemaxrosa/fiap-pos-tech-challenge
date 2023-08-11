import { Injectable, Logger } from '@nestjs/common';

import { ValidationException } from '../../../domain/exception/validation.exception';
import { ItemPedido } from '../model/item-pedido.model';
import { AddItemPedidoValidator } from './add-item-pedido.validator';

@Injectable()
export class QuantidadeMinimaItemValidator implements AddItemPedidoValidator {
   public static ERROR_MESSAGE = 'A quantidade minima para um produto deve ser maio que zero';

   private logger = new Logger(QuantidadeMinimaItemValidator.name);

   async validate({ quantidade, pedidoId, produtoId }: ItemPedido): Promise<boolean> {
      this.logger.log(
         `Inicializando validação ${QuantidadeMinimaItemValidator.name} para quantidade minima de um item do pedido.`,
      );

      if (quantidade > 0) {
         this.logger.debug(
            `${QuantidadeMinimaItemValidator.name} finalizado com sucesso do produto: ${produtoId} ao pedido: ${pedidoId}`,
         );

         return true;
      }

      this.logger.error(`Quantidade minima de um novo item invalida: ${quantidade}`);
      throw new ValidationException(QuantidadeMinimaItemValidator.ERROR_MESSAGE);
   }
}
