import { Injectable, Logger } from '@nestjs/common';
import { ValidationException } from 'src/enterprise/exception/validation.exception';
import { Pedido } from 'src/enterprise/pedido/model/pedido.model';
import { SalvarPedidoValidator } from 'src/application/pedido/validation/salvar-pedido.validator';
import { DateUtils } from 'src/shared/date.utils';
import { EditarPedidoValidator } from 'src/application/pedido/validation/editar-pedido.validator';

@Injectable()
export class DataInicioNovoPedidoValidator implements SalvarPedidoValidator, EditarPedidoValidator {
   public static ERROR_MESSAGE = 'A data de início do pedido é inválida (Não é a data atual). ';

   private logger: Logger = new Logger(DataInicioNovoPedidoValidator.name);

   async validate(pedido: Pedido): Promise<boolean> {
      this.logger.log(
         `Inicializando validação ${DataInicioNovoPedidoValidator.name} para criar o pedido com a data de início correta`,
      );

      if (DateUtils.toString(new Date()) === pedido.dataInicio) {
         this.logger.debug(
            `${DataInicioNovoPedidoValidator.name} finalizado com sucesso para novo pedido com data de início : ${pedido.dataInicio}`,
         );
         return true;
      }

      this.logger.error(`Data de inicio de um novo pedido invalido: ${pedido.dataInicio}`);
      throw new ValidationException(DataInicioNovoPedidoValidator.ERROR_MESSAGE);
   }
}
