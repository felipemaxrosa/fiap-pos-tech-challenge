import { IValidator } from 'src/domain/validation/validator';
import { Cliente } from '../model/cliente.model';
import { cpf as cpfUtils } from 'cpf-cnpj-validator';
import { ValidationException } from 'src/domain/exception/validation.exception';
import { Logger } from '@nestjs/common';

export class CpfValidoClienteValidator implements IValidator<Cliente> {
   public static CPF_VALIDO_CLIENTE_VALIDATOR_ERROR_MESSAGE = 'O CPF do cliente não é válido';
   private logger: Logger = new Logger(CpfValidoClienteValidator.name);

   async validate(cliente: Cliente): Promise<boolean> {
      this.logger.log(`Inicializando validação ${CpfValidoClienteValidator.name} de cpf válido: ${cliente.cpf}`);

      if (!cpfUtils.isValid(cliente.cpf)) {
         throw new ValidationException(CpfValidoClienteValidator.CPF_VALIDO_CLIENTE_VALIDATOR_ERROR_MESSAGE);
      }

      return true;
   }
}
