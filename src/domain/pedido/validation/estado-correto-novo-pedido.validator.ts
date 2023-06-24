import { Injectable, Logger } from '@nestjs/common';

import { ValidationException } from 'src/domain/exception/validation.exception';
import { Pedido } from '../model/pedido.model';
import { CriarNovoPedidoValidator } from './criar-novo-pedido.validator';
import { ESTADO_PEDIDO } from '../enums/pedido';

@Injectable()
export class EstadoCorretoNovoPedidoValidator implements CriarNovoPedidoValidator {
   public static ESTADO_CORRETO_NOVO_PEDIDO_VALIDATOR_ERROR_MESSAGE =
      'O estado inicial de um novo pedido deve ser "Recebido"';

   private logger: Logger = new Logger(EstadoCorretoNovoPedidoValidator.name);

   // constructor(@Inject(PedidoConstants.IREPOSITORY) private repository: IRepository<Pedido>) {}

   async validate({ estadoPedido }: Pedido): Promise<boolean> {
      this.logger.log(
         `Inicializando validação ${EstadoCorretoNovoPedidoValidator.name} para criar o pedido com o estado correto.`,
      );
      console.log({ estadoPedido, esperado: ESTADO_PEDIDO.RECEBIDO });

      if (estadoPedido === ESTADO_PEDIDO.RECEBIDO) {
         this.logger.debug(
            `${EstadoCorretoNovoPedidoValidator.name} finalizado com sucesso para novo pedido com estado: ${estadoPedido}`,
         );
         return true;
      }

      this.logger.warn(`estadoPedido: ${estadoPedido}, esperado: ${ESTADO_PEDIDO.RECEBIDO}`);

      this.logger.error(`Estado de um novo pedido invalido: ${estadoPedido}`);
      throw new ValidationException(
         EstadoCorretoNovoPedidoValidator.ESTADO_CORRETO_NOVO_PEDIDO_VALIDATOR_ERROR_MESSAGE,
      );
   }
}
