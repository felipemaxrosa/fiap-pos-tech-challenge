import { Inject, Injectable, Logger } from '@nestjs/common';

import { ClienteConstants } from '../../../shared/constants';
import { IValidator } from '../../../domain/validation/validator';
import { IRepository } from '../../../domain/repository/repository';
import { Cliente } from '../../../domain/cliente/model/cliente.model';
import { ServiceException } from '../../../domain/exception/service.exception';
import { SalvarClienteValidator } from '../../../domain/cliente/validation/salvar-cliente.validator';
import { ClienteIdentificado } from '../model/cliente-identificado.model';
import { BuscarClienteValidator } from '../validation/buscar-cliente.validator';
import { IClienteService } from './cliente.service.interface';

@Injectable()
export class ClienteService implements IClienteService {
   private logger: Logger = new Logger(ClienteService.name);

   constructor(
      @Inject(ClienteConstants.IREPOSITORY) private repository: IRepository<Cliente>,
      @Inject(ClienteConstants.SALVAR_CLIENTE_VALIDATOR) private salvarValidators: SalvarClienteValidator[],
      @Inject(ClienteConstants.BUSCAR_CLIENTE_VALIDATOR) private buscarValidators: BuscarClienteValidator[],
   ) {}

   async findByCpf(cpf: string): Promise<Cliente> {
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

   async save(cliente: Cliente): Promise<Cliente> {
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

   async identifyByCpf(cpf: string): Promise<ClienteIdentificado> {
      if (cpf === undefined) {
         return Promise.resolve(new ClienteIdentificado(undefined));
      }

      return await this.findByCpf(cpf).then((cliente) => {
         return new ClienteIdentificado(cliente);
      });
   }

   edit(): Promise<Cliente> {
      throw new ServiceException(`Método não implementado.`);
   }

   delete(): Promise<boolean> {
      throw new ServiceException('Método não implementado.');
   }

   findById(): Promise<Cliente> {
      throw new ServiceException('Método não implementado.');
   }

   private async validate(validators: IValidator<Cliente>[], cliente: Cliente): Promise<void> {
      for (const validator of validators) {
         await validator.validate(cliente);
      }
   }
}
