import { Inject, Injectable, Logger } from '@nestjs/common';
import { WebhookPagamentoValidator } from 'src/application/pagamento/validation/webhook-pagamento.validator';
import { ValidationException } from 'src/enterprise/exception/validation.exception';
import { Pagamento } from 'src/enterprise/pagamento/model/pagamento.model';
import { EstadoPedido } from 'src/enterprise/pedido/enums/pedido';
import { Pedido } from 'src/enterprise/pedido/model/pedido.model';
import { IRepository } from 'src/enterprise/repository/repository';
import { PedidoConstants } from 'src/shared/constants';

@Injectable()
export class WebhookPagamentoPedidoValidoValidator implements WebhookPagamentoValidator {
   public static PEDIDO_INEXISTENTE_ERROR_MESSAGE = 'Código de pedido inexistente';
   public static ESTADO_PEDIDO_DIFERENTE_PAGAMENTO_PENDENTE_ERROR_MESSAGE =
      'O estado do pedido precisa ser PAGAMENTO_PENDENTE';

   private logger: Logger = new Logger(WebhookPagamentoPedidoValidoValidator.name);

   constructor(@Inject(PedidoConstants.IREPOSITORY) private repositoryPedido: IRepository<Pedido>) {}

   async validate(pagamento: Pagamento): Promise<boolean> {
      const pedidoId = pagamento.pedidoId;
      this.logger.log(
         `Inicializando validação ${WebhookPagamentoPedidoValidoValidator.name} para validar o estado do pedido id: ${pedidoId}`,
      );

      await this.repositoryPedido.findBy({ id: pedidoId }).then((pedidos) => {
         if (pedidos.length === 0) {
            throw new ValidationException(WebhookPagamentoPedidoValidoValidator.PEDIDO_INEXISTENTE_ERROR_MESSAGE);
         }
         if (pedidos[0].estadoPedido !== EstadoPedido.PAGAMENTO_PENDENTE) {
            this.logger.debug(`O estado do pedido precisa ser PAGAMENTO_PENDENTE, mas é ${pedidos[0].estadoPedido}`);
            throw new ValidationException(
               WebhookPagamentoPedidoValidoValidator.ESTADO_PEDIDO_DIFERENTE_PAGAMENTO_PENDENTE_ERROR_MESSAGE,
            );
         }
      });
      return true;
   }
}
