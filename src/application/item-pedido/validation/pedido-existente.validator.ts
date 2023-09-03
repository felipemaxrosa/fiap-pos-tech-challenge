import { Inject, Injectable, Logger } from '@nestjs/common';
import { ValidationException } from 'src/enterprise/exception/validation.exception';
import { Pedido } from 'src/enterprise/pedido/model/pedido.model';
import { ItemPedido } from 'src/enterprise/item-pedido/model';
import { AddItemPedidoValidator } from 'src/application/item-pedido/validation/add-item-pedido.validator';
import { IRepository } from 'src/enterprise/repository/repository';
import { PedidoConstants } from 'src/shared/constants';

@Injectable()
export class PedidoExistenteValidator implements AddItemPedidoValidator {
   public static ERROR_MESSAGE = 'Código de pedido inexistente';

   private logger = new Logger(PedidoExistenteValidator.name);

   constructor(@Inject(PedidoConstants.IREPOSITORY) private repository: IRepository<Pedido>) {}

   async validate({ pedidoId }: ItemPedido): Promise<boolean> {
      this.logger.log(`Inicializando validação ${PedidoExistenteValidator.name} de pedido existente: ${pedidoId}`);

      return this.repository.findBy({ id: pedidoId }).then((items) => {
         if (items.length > 0) {
            this.logger.debug(`${PedidoExistenteValidator.name} finalizado com sucesso para pedido: ${pedidoId}`);
            return true;
         }

         this.logger.error(`Pedido nao existe na base de dados com o id: ${pedidoId}`);
         throw new ValidationException(PedidoExistenteValidator.ERROR_MESSAGE);
      });
   }
}
