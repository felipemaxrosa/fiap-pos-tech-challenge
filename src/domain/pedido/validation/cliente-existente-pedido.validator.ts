import { Inject, Injectable, Logger } from '@nestjs/common';

import { Pedido } from '../model/pedido.model';
import { SalvarPedidoValidator } from './salvar-pedido.validator';
import { IRepository } from '../../../domain/repository/repository';
import { Cliente } from '../../../domain/cliente/model/cliente.model';
import { ValidationException } from '../../../domain/exception/validation.exception';

@Injectable()
export class ClienteExistentePedidoValidator implements SalvarPedidoValidator {

   public static ERROR_MESSAGE = 'Código de cliente inexistente';

   private logger: Logger = new Logger(ClienteExistentePedidoValidator.name);

   constructor(@Inject('IRepository<Cliente>') private repository: IRepository<Cliente>) {}

   async validate(pedido: Pedido): Promise<boolean> {
      this.logger.log(`Inicializando validação ${ClienteExistentePedidoValidator.name} para criar o pedido com cliente: ${pedido.clienteId}`);

      await this.repository.findBy({id: pedido.clienteId})
         .then((clientes) => {
            if(clientes.length === 0) {
               throw new ValidationException(ClienteExistentePedidoValidator.ERROR_MESSAGE);
            }
         })

      return true
   }
}
