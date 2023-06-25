import { Injectable, Logger } from '@nestjs/common';

import { Cliente } from '../../../../domain/cliente/model/cliente.model';
import { IRepository } from '../../../../domain/repository/repository';
import { RepositoryException } from '../../../exception/repository.exception';

@Injectable()
export class ClienteMemoryRepository implements IRepository<Cliente> {
   private logger: Logger = new Logger(ClienteMemoryRepository.name);

   private repository: Array<Cliente> = [];
   private static ID_COUNT = 0;

   async findBy(attributes: any): Promise<Cliente[]> {
      this.logger.debug(`Realizando consulta de cliente: com os parâmetros ${JSON.stringify(attributes)}`);
      return new Promise((resolve) => {
         resolve(
            this.repository.filter((cliente) => {
               return Object.entries(attributes).every(([key, value]) => {
                  return cliente[key] === value;
               });
            }),
         );
      });
   }

   async save(cliente: Cliente): Promise<Cliente> {
      this.logger.debug(`Salvando cliente: ${cliente}`);
      return new Promise<Cliente>((resolve) => {
         this.repository.push(cliente);
         cliente.id = ++ClienteMemoryRepository.ID_COUNT;
         resolve(cliente);
      });
   }

   edit(): Promise<Cliente> {
      throw new RepositoryException('Método não implementado.');
   }

   delete(): Promise<boolean> {
      throw new RepositoryException('Método não implementado.');
   }

   findAll(): Promise<Cliente[]> {
      throw new RepositoryException('Método não implementado.');
   }
}
