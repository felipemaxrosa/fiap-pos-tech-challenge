import { Inject, Injectable, Logger } from '@nestjs/common';

import { ClienteConstants } from '../../../shared/constants';
import { IRepository } from '../../../domain/repository/repository';
import { ValidationException } from '../../../domain/exception/validation.exception';
import { Cliente } from '../model/cliente.model';
import { SalvarClienteValidator } from './salvar-cliente.validator';

@Injectable()
export class EmailUnicoClienteValidator implements SalvarClienteValidator {
   public static EMAIL_UNICO_CLIENTE_VALIDATOR_ERROR_MESSAGE = 'O email do cliente não é único';

   private logger: Logger = new Logger(EmailUnicoClienteValidator.name);

   constructor(@Inject(ClienteConstants.IREPOSITORY) private repository: IRepository<Cliente>) {}

   async validate(cliente: Cliente): Promise<boolean> {
      this.logger.log(`Inicializando validação ${EmailUnicoClienteValidator.name} de email único: ${cliente.email}`);

      return this.repository.findBy({ email: cliente.email }).then((clients) => {
         if (clients.length > 0) {
            this.logger.error(`Cliente já existente na base de dados com o email: ${cliente.email}`);
            throw new ValidationException(EmailUnicoClienteValidator.EMAIL_UNICO_CLIENTE_VALIDATOR_ERROR_MESSAGE);
         }

         this.logger.debug(`${EmailUnicoClienteValidator.name} finalizado com sucesso para cliente: ${cliente.email}`);
         return true;
      });
   }
}
