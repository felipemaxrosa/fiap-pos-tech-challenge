import { Cliente } from '../model/cliente.model';
import { ValidationException } from 'src/domain/exception/validation.exception';
import { SalvarClienteValidator } from './salvar-cliente.validator';

export class EmailValidoClienteValidator implements SalvarClienteValidator {
   public static EMAIL_VALIDO_CLIENTE_VALIDATOR_ERROR_MESSAGE = 'O email do cliente não é válido';
   private emailRegex = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;

   async validate(cliente: Cliente): Promise<boolean> {
      if (!this.emailRegex.test(cliente.email)) {
         throw new ValidationException(EmailValidoClienteValidator.EMAIL_VALIDO_CLIENTE_VALIDATOR_ERROR_MESSAGE);
      }

      return true;
   }
}
