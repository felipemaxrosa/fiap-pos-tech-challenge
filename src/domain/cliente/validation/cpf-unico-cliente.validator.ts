import { Inject, Injectable, Logger } from '@nestjs/common';

import { SalvarClienteValidator } from './salvar-cliente.validator';
import { ValidationException } from 'src/domain/exception/validation.exception';
import { Cliente } from '../model/cliente.model';
import { IRepository } from 'src/domain/repository/repository';

@Injectable()
export class CpfUnicoClienteValidator implements SalvarClienteValidator {
   public static CPF_UNICO_CLIENTE_VALIDATOR_ERROR_MESSAGE = 'O cpf do cliente não é único';

   private logger: Logger = new Logger(CpfUnicoClienteValidator.name);

   constructor(@Inject('IRepository<Cliente>') private repository: IRepository<Cliente>) {}

   async validate(cliente: Cliente): Promise<boolean> {
      this.logger.log(`Inicializando validação ${CpfUnicoClienteValidator.name} de cpf único: ${cliente.cpf}`);

      return this.repository.findBy({ cpf: cliente.cpf }).then((clients) => {
         if (clients.length > 0) {
            this.logger.error(`Cliente já existente na base de dados com o CPF: ${cliente.cpf}`);
            throw new ValidationException(CpfUnicoClienteValidator.CPF_UNICO_CLIENTE_VALIDATOR_ERROR_MESSAGE);
         }

         this.logger.debug(`${CpfUnicoClienteValidator.name} finalizado com sucesso para cliente: ${cliente.cpf}`);
         return true;
      });
   }
}
