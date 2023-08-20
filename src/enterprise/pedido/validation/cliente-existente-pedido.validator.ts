import { Inject, Injectable, Logger } from '@nestjs/common';
import { Cliente } from 'src/enterprise/cliente/model/cliente.model';
import { ValidationException } from 'src/enterprise/exception/validation.exception';
import { Pedido } from 'src/enterprise/pedido/model/pedido.model';
import { SalvarPedidoValidator } from 'src/enterprise/pedido/validation/salvar-pedido.validator';
import { IRepository } from 'src/enterprise/repository/repository';
import { ClienteConstants } from 'src/shared/constants';


@Injectable()
export class ClienteExistentePedidoValidator implements SalvarPedidoValidator {
   public static ERROR_MESSAGE = 'Código de cliente inexistente';

   private logger: Logger = new Logger(ClienteExistentePedidoValidator.name);

   constructor(@Inject(ClienteConstants.IREPOSITORY) private repository: IRepository<Cliente>) {}

   async validate(pedido: Pedido): Promise<boolean> {
      this.logger.log(
         `Inicializando validação ${ClienteExistentePedidoValidator.name} para criar o pedido com cliente: ${pedido.clienteId}`,
      );

      await this.repository.findBy({ id: pedido.clienteId }).then((clientes) => {
         if (clientes.length === 0) {
            throw new ValidationException(ClienteExistentePedidoValidator.ERROR_MESSAGE);
         }
      });

      return true;
   }
}
