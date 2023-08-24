import { Inject, Injectable, Logger } from '@nestjs/common';
import { Cliente } from 'src/enterprise/cliente/model/cliente.model';
import { SalvarClienteValidator } from 'src/application/cliente/validation/salvar-cliente.validator';
import { ServiceException } from 'src/enterprise/exception/service.exception';
import { IRepository } from 'src/enterprise/repository/repository';
import { IValidator } from 'src/enterprise/validation/validator';
import { ClienteConstants } from 'src/shared/constants';

@Injectable()
export class SalvarClienteUseCase {
   private logger: Logger = new Logger(SalvarClienteUseCase.name);

   constructor(
      @Inject(ClienteConstants.IREPOSITORY) private repository: IRepository<Cliente>,
      @Inject(ClienteConstants.SALVAR_CLIENTE_VALIDATOR) private salvarValidators: SalvarClienteValidator[],
   ) {}

   async salvarCliente(cliente: Cliente): Promise<Cliente> {
      await this.validate(this.salvarValidators, cliente);

      return await this.repository
         .save({
            nome: cliente.nome,
            email: cliente.email,
            cpf: cliente.cpf,
         })
         .catch((error) => {
            this.logger.error(`Erro ao salvar no banco de dados: ${error} `);
            throw new ServiceException(`Houve um erro ao salvar o cliente: ${error}`);
         });
   }

   private async validate(validators: IValidator<Cliente>[], cliente: Cliente): Promise<void> {
      for (const validator of validators) {
         await validator.validate(cliente);
      }
   }
}
