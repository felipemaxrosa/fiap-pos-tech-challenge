import { Inject, Injectable, Logger } from '@nestjs/common';
import { CheckoutPedidoValidator } from 'src/application/pedido/validation/checkout-pedido.validator';
import { ValidationException } from 'src/enterprise/exception/validation.exception';
import { EstadoPedido } from 'src/enterprise/pedido/enum/estado-pedido.enum';
import { Pedido } from 'src/enterprise/pedido/model/pedido.model';
import { IRepository } from 'src/enterprise/repository/repository';
import { PedidoConstants } from 'src/shared/constants';

@Injectable()
export class CheckoutPedidoValidoValidator implements CheckoutPedidoValidator {
   public static PEDIDO_INEXISTENTE_ERROR_MESSAGE = 'Código de pedido inexistente';
   public static CHECKOUT_JA_REALIZADO_ERROR_MESSAGE = 'Pedido informado já realizou checkout';

   private logger: Logger = new Logger(CheckoutPedidoValidoValidator.name);

   constructor(@Inject(PedidoConstants.IREPOSITORY) private repositoryPedido: IRepository<Pedido>) {}

   async validate({ id }: Pedido): Promise<boolean> {
      this.logger.log(
         `Inicializando validação ${CheckoutPedidoValidoValidator.name} para realizar o checkout para o pedido com id: ${id}`,
      );

      if (!id) {
         throw new ValidationException(CheckoutPedidoValidoValidator.PEDIDO_INEXISTENTE_ERROR_MESSAGE);
      }

      await this.repositoryPedido.findBy({ id: id }).then((pedidos) => {
         if (pedidos.length === 0) {
            throw new ValidationException(CheckoutPedidoValidoValidator.PEDIDO_INEXISTENTE_ERROR_MESSAGE);
         }
         if (pedidos[0].estadoPedido !== EstadoPedido.PAGAMENTO_PENDENTE) {
            this.logger.debug(`O estado do pedido precisa ser PAGAMENTO_PENDENTE, mas é ${pedidos[0].estadoPedido}`);
            throw new ValidationException(CheckoutPedidoValidoValidator.CHECKOUT_JA_REALIZADO_ERROR_MESSAGE);
         }
      });

      return true;
   }
}
