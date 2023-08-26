import { Inject, Injectable, Logger } from '@nestjs/common';
import { Cliente } from 'src/enterprise/cliente/model/cliente.model';
import { BuscarClienteValidator } from 'src/application/cliente/validation/buscar-cliente.validator';
import { ServiceException } from 'src/enterprise/exception/service.exception';
import { IRepository } from 'src/enterprise/repository/repository';
import { ClienteConstants } from 'src/shared/constants';
import { ValidatorUtils } from 'src/shared/validator.utils';

@Injectable()
export class BuscarClientePorCpfUseCase {
   private logger: Logger = new Logger(BuscarClientePorCpfUseCase.name);

   constructor(
      @Inject(ClienteConstants.IREPOSITORY) private repository: IRepository<Cliente>,
      @Inject(ClienteConstants.BUSCAR_CLIENTE_VALIDATOR) private buscarValidators: BuscarClienteValidator[],
   ) {}

   async buscarClientePorCpf(cpf: string): Promise<Cliente> {
      await ValidatorUtils.executeValidators(this.buscarValidators, new Cliente(undefined, undefined, cpf));
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
}
