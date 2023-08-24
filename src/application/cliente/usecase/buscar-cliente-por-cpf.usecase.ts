import { Inject, Injectable, Logger } from '@nestjs/common';
import { Cliente } from 'src/enterprise/cliente/model/cliente.model';
import { BuscarClienteValidator } from 'src/application/cliente/validation/buscar-cliente.validator';
import { ServiceException } from 'src/enterprise/exception/service.exception';
import { IRepository } from 'src/enterprise/repository/repository';
import { IValidator } from 'src/enterprise/validation/validator';
import { ClienteConstants } from 'src/shared/constants';

@Injectable()
export class BuscarClientePorCpfUsecase {
   private logger: Logger = new Logger(BuscarClientePorCpfUsecase.name);

   constructor(
      @Inject(ClienteConstants.IREPOSITORY) private repository: IRepository<Cliente>,
      @Inject(ClienteConstants.BUSCAR_CLIENTE_VALIDATOR) private buscarValidators: BuscarClienteValidator[],
   ) {}

   async buscarClientePorCpf(cpf: string): Promise<Cliente> {
      await this.validate(this.buscarValidators, new Cliente(undefined, undefined, cpf));

      return await this.repository
         .findBy({ cpf: cpf })
         .then((clientes) => {
            return clientes[0];
         })
         .catch((error) => {
            this.logger.error(`Erro ao consultar cliente no banco de dados: ${error} `);
            throw new ServiceException(`Houve um erro ao consultar o cliente: ${error}`);
         });
   }

   private async validate(validators: IValidator<Cliente>[], cliente: Cliente): Promise<void> {
      for (const validator of validators) {
         await validator.validate(cliente);
      }
   }
}
