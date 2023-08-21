import { Logger } from '@nestjs/common';
import { Cliente } from 'src/enterprise/cliente/model/cliente.model';
import { SalvarClienteValidator } from 'src/application/cliente/validation/salvar-cliente.validator';
import { ValidationException } from 'src/enterprise/exception/validation.exception';

export class EmailValidoClienteValidator implements SalvarClienteValidator {
   public static EMAIL_VALIDO_CLIENTE_VALIDATOR_ERROR_MESSAGE = 'O email do cliente não é válido';
   private logger: Logger = new Logger(EmailValidoClienteValidator.name);
   private emailRegex = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;

   async validate(cliente: Cliente): Promise<boolean> {
      this.logger.log(`Inicializando validação ${EmailValidoClienteValidator.name} de email válido: ${cliente.email}`);

      if (!this.emailRegex.test(cliente.email)) {
         throw new ValidationException(EmailValidoClienteValidator.EMAIL_VALIDO_CLIENTE_VALIDATOR_ERROR_MESSAGE);
      }

      return true;
   }
}
