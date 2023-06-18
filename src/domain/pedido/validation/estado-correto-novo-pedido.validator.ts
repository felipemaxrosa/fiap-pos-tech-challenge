import { Inject, Injectable, Logger } from '@nestjs/common';

import { ValidationException } from 'src/domain/exception/validation.exception';
import { IRepository } from 'src/domain/repository/repository';
import { Pedido } from '../model/pedido.model';
import { CriarNovoPedidoValidator } from './criar-novo-pedido.validator';
import { PedidoConstants } from 'src/shared/constants';
import { ESTADO_PEDIDO } from '../enums/pedido';

@Injectable()
export class EstadoCorretoNovoPedidoValidator implements CriarNovoPedidoValidator {
   public static ESTADO_CORRETO_NOVO_PEDIDO_VALIDATOR_ERROR_MESSAGE =
      'O estado inicial de um novo pedido deve ser "Recebido"';

   private logger: Logger = new Logger(EstadoCorretoNovoPedidoValidator.name);

   // constructor(@Inject(PedidoConstants.IREPOSITORY) private repository: IRepository<Pedido>) {}

   async validate(pedido: Pedido): Promise<boolean> {
      this.logger.log(
         `Inicializando validação ${EstadoCorretoNovoPedidoValidator.name} para criar o pedido com o estado correto.`,
      );

      if (pedido.estadoPedido === ESTADO_PEDIDO.RECEBIDO) {
         this.logger.debug(
            `${EstadoCorretoNovoPedidoValidator.name} finalizado com sucesso para novo pedido com estado: ${pedido.estadoPedido}`,
         );
         return true;
      }

      this.logger.error(`Estado de um novo pedido invalido: ${pedido.estadoPedido}`);
      throw new ValidationException(
         EstadoCorretoNovoPedidoValidator.ESTADO_CORRETO_NOVO_PEDIDO_VALIDATOR_ERROR_MESSAGE,
      );
   }
}
