import { Inject, Injectable, Logger } from '@nestjs/common';

import { ValidationException } from 'src/domain/exception/validation.exception';
import { IRepository } from 'src/domain/repository/repository';
import { EditarItemPedidoValidator } from './editar-item-pedido.validator';
import { ItemPedido } from '../model';
import { ItemPedidoConstants } from 'src/shared/constants';

@Injectable()
export class ItemPedidoExistenteValidator implements EditarItemPedidoValidator {
   public static ERROR_MESSAGE = 'Item de pedido inexistente';

   private logger = new Logger(ItemPedidoExistenteValidator.name);

   constructor(@Inject(ItemPedidoConstants.IREPOSITORY) private repository: IRepository<ItemPedido>) {}

   async validate({ id }: ItemPedido): Promise<boolean> {
      this.logger.log(`Inicializando validação ${ItemPedidoExistenteValidator.name} de item existente: ${id}`);

      return this.repository.findBy({ id }).then((items) => {
         if (items.length > 0) {
            this.logger.debug(`${ItemPedidoExistenteValidator.name} finalizado com sucesso para item de pedido: ${id}`);
            return true;
         }

         this.logger.error(`Item de pedido nao existe na base de dados com o id: ${id}`);
         throw new ValidationException(ItemPedidoExistenteValidator.ERROR_MESSAGE);
      });
   }
}
