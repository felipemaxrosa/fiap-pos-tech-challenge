import { Injectable, Logger } from '@nestjs/common';

import { ValidationException } from 'src/domain/exception/validation.exception';
import { Pedido } from '../model/pedido.model';
import { CriarNovoPedidoValidator } from './criar-novo-pedido.validator';
import { ESTADO_PEDIDO } from '../enums/pedido';

@Injectable()
export class EstadoCorretoNovoPedidoValidator implements CriarNovoPedidoValidator {
   public static ERROR_MESSAGE = 'O estado inicial de um novo pedido deve ser "Recebido"';

   private logger: Logger = new Logger(EstadoCorretoNovoPedidoValidator.name);

   async validate({ estadoPedido }: Pedido): Promise<boolean> {
      this.logger.log(
         `Inicializando validação ${EstadoCorretoNovoPedidoValidator.name} para criar o pedido com o estado correto.`,
      );

      if (estadoPedido === ESTADO_PEDIDO.RECEBIDO) {
         this.logger.debug(
            `${EstadoCorretoNovoPedidoValidator.name} finalizado com sucesso para novo pedido com estado: ${estadoPedido}`,
         );
         return true;
      }

      this.logger.error(`Estado de um novo pedido invalido: ${estadoPedido}`);
      throw new ValidationException(EstadoCorretoNovoPedidoValidator.ERROR_MESSAGE);
   }
}
