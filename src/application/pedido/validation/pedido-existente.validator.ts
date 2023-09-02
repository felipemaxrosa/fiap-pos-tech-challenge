import { Inject, Injectable, Logger } from '@nestjs/common';
import { ValidationException } from 'src/enterprise/exception/validation.exception';
import { Pedido } from 'src/enterprise/pedido/model/pedido.model';
import { IRepository } from 'src/enterprise/repository/repository';
import { PedidoConstants } from 'src/shared/constants';
import { EditarPedidoValidator } from 'src/application/pedido/validation/editar-pedido.validator';

@Injectable()
export class PedidoExistenteValidator implements EditarPedidoValidator {
   public static ERROR_MESSAGE = 'Código de pedido inexistente';

   private logger: Logger = new Logger(PedidoExistenteValidator.name);

   constructor(@Inject(PedidoConstants.IREPOSITORY) private repository: IRepository<Pedido>) {}

   async validate(pedido: Pedido): Promise<boolean> {
      this.logger.log(
         `Inicializando validação ${PedidoExistenteValidator.name} para editar o pedido ${pedido.id} do cliente: ${pedido.clienteId}`,
      );

      await this.repository.findBy({ id: pedido.id }).then((pedidos) => {
         if (pedidos.length === 0) {
            throw new ValidationException(PedidoExistenteValidator.ERROR_MESSAGE);
         }
      });

      return true;
   }
}
