import { Inject, Injectable, Logger } from '@nestjs/common';

import { Cliente } from 'src/domain/cliente/model/cliente.model';
import { SalvarClienteValidator } from 'src/domain/cliente/validation/salvar-cliente.validator';
import { IRepository } from 'src/domain/repository/repository';
import { ServiceException } from 'src/domain/exception/service.exception';
import { IClienteService } from './cliente.service.interface';
import { BuscarClienteValidator } from '../validation/buscar-cliente.validator';
import { IValidator } from 'src/domain/validation/validator';

@Injectable()
export class ClienteService implements IClienteService {
   private logger: Logger = new Logger(ClienteService.name);

   constructor(
      @Inject('IRepository<Cliente>') private repository: IRepository<Cliente>,
      @Inject('SalvarClienteValidator') private salvarValidators: SalvarClienteValidator[],
      @Inject('BuscarClienteValidator') private buscarValidators: BuscarClienteValidator[],
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

   edit(): Promise<Cliente> {
      throw new ServiceException(`Método não implementado.`);
   }

   delete(): Promise<boolean> {
      throw new ServiceException('Método não implementado.');
   }

   private async validate(validators: IValidator<Cliente>[], cliente: Cliente): Promise<void> {
      for (const validator of validators) {
         await validator.validate(cliente);
      }
   }

   findById(): Promise<Cliente> {
      throw new ServiceException('Método não implementado.');
   }
}
