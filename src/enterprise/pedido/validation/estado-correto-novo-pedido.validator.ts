import { Injectable, Logger } from '@nestjs/common';
import { ValidationException } from 'src/enterprise/exception/validation.exception';
import { EstadoPedido } from 'src/enterprise/pedido/enums/pedido';
import { Pedido } from 'src/enterprise/pedido/model/pedido.model';
import { SalvarPedidoValidator } from 'src/enterprise/pedido/validation/salvar-pedido.validator';


@Injectable()
export class EstadoCorretoNovoPedidoValidator implements SalvarPedidoValidator {
   public static ERROR_MESSAGE = `O estado inicial de um novo pedido deve ser ${EstadoPedido.RECEBIDO} (${
      EstadoPedido[EstadoPedido.RECEBIDO]
   })`;

   private logger: Logger = new Logger(EstadoCorretoNovoPedidoValidator.name);

   async validate({ estadoPedido }: Pedido): Promise<boolean> {
      this.logger.log(
         `Inicializando validação ${EstadoCorretoNovoPedidoValidator.name} para criar o pedido com o estado correto.`,
      );

      if (estadoPedido === EstadoPedido.RECEBIDO) {
         this.logger.debug(
            `${EstadoCorretoNovoPedidoValidator.name} finalizado com sucesso para novo pedido com estado: ${estadoPedido}`,
         );
         return true;
      }

      this.logger.error(`Estado de um novo pedido invalido: ${estadoPedido}`);
      throw new ValidationException(EstadoCorretoNovoPedidoValidator.ERROR_MESSAGE);
   }
}
