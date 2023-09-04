import { Inject, Injectable, Logger } from '@nestjs/common';
import { CheckoutPedidoValidator } from 'src/application/pedido/validation/checkout-pedido.validator';
import { ValidationException } from 'src/enterprise/exception/validation.exception';
import { Pagamento } from 'src/enterprise/pagamento/model/pagamento.model';
import { Pedido } from 'src/enterprise/pedido/model/pedido.model';
import { IRepository } from 'src/enterprise/repository/repository';
import { PagamentoConstants } from 'src/shared/constants';

@Injectable()
export class CheckoutPedidoRealizadoValidator implements CheckoutPedidoValidator {
   public static CHECKOUT_JA_REALIZADO_ERROR_MESSAGE = 'Pedido informado já realizou checkout';

   private logger: Logger = new Logger(CheckoutPedidoRealizadoValidator.name);

   constructor(@Inject(PagamentoConstants.IREPOSITORY) private repository: IRepository<Pagamento>) {}

   async validate({ id }: Pedido): Promise<boolean> {
      this.logger.log(
         `Inicializando validação ${CheckoutPedidoRealizadoValidator.name} para realizar o checkout para o pedido com id: ${id}`,
      );

      await this.repository.findBy({ pedidoId: id }).then((pagamento) => {
         if (pagamento.length > 0) {
            this.logger.debug(`O pedido ${id} já realizou checkout (Pagamento: ${pagamento[0].estadoPagamento})`);
            throw new ValidationException(CheckoutPedidoRealizadoValidator.CHECKOUT_JA_REALIZADO_ERROR_MESSAGE);
         }
      });

      return true;
   }
}
