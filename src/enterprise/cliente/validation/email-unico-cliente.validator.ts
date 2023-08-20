import { Inject, Injectable, Logger } from '@nestjs/common';
import { Cliente } from 'src/enterprise/cliente/model/cliente.model';
import { SalvarClienteValidator } from 'src/enterprise/cliente/validation/salvar-cliente.validator';
import { ValidationException } from 'src/enterprise/exception/validation.exception';
import { IRepository } from 'src/enterprise/repository/repository';
import { ClienteConstants } from 'src/shared/constants';

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
