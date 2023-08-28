import { Inject, Injectable, Logger } from '@nestjs/common';
import { CheckoutPedidoValidator } from 'src/application/pedido/validation/checkout-pedido.validator';
import { ValidationException } from 'src/enterprise/exception/validation.exception';
import { Pedido } from 'src/enterprise/pedido/model/pedido.model';
import { IRepository } from 'src/enterprise/repository/repository';
import { PedidoConstants } from 'src/shared/constants';

@Injectable()
export class CheckoutPedidoIdValidoValidator implements CheckoutPedidoValidator {
   public static PEDIDO_INEXISTENTE_ERROR_MESSAGE = 'Código de pedido inexistente';

   private logger: Logger = new Logger(CheckoutPedidoIdValidoValidator.name);

   constructor(@Inject(PedidoConstants.IREPOSITORY) private repositoryPedido: IRepository<Pedido>) {}

   async validate({ id }: Pedido): Promise<boolean> {
      this.logger.log(
         `Inicializando validação ${CheckoutPedidoIdValidoValidator.name} para realizar o checkout para o pedido com id: ${id}`,
      );

      if (!id) {
         throw new ValidationException(CheckoutPedidoIdValidoValidator.PEDIDO_INEXISTENTE_ERROR_MESSAGE);
      }

      await this.repositoryPedido.findBy({ id: id }).then((pedidos) => {
         if (pedidos.length !== 1) {
            throw new ValidationException(CheckoutPedidoIdValidoValidator.PEDIDO_INEXISTENTE_ERROR_MESSAGE);
         }
      });

      return true;
   }
}
