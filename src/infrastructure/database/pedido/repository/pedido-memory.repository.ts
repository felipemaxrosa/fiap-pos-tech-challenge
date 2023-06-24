import { RepositoryException } from './../../../exception/repository.exception';
import { Injectable, Logger } from '@nestjs/common';

import { Pedido } from '../../../../domain/pedido/model/pedido.model';
import { IRepository } from '../../../../domain/repository/repository';

@Injectable()
export class PedidoMemoryRepository implements IRepository<Pedido> {
   private logger: Logger = new Logger(PedidoMemoryRepository.name);

   private repository: Array<Pedido> = [];
   private static ID_COUNT = 0;

   async findBy(attributes: any): Promise<Pedido[]> {
      this.logger.debug(`Realizando consulta de pedidos: com os parâmetros ${JSON.stringify(attributes)}`);
      return new Promise((resolve) => {
         resolve(
            this.repository.filter((pedido) => {
               return Object.entries(attributes).every(([key, value]) => {
                  return pedido[key] === value;
               });
            }),
         );
      });
   }

   async save(pedido: Pedido): Promise<Pedido> {
      this.logger.debug(`Criando novo pedido: ${pedido}`);
      return new Promise<Pedido>((resolve) => {
         this.repository.push(pedido);
         pedido.id = ++PedidoMemoryRepository.ID_COUNT;
         resolve(pedido);
      });
   }

   async edit(): Promise<Pedido> {
      throw new RepositoryException('Método não implementado.');
   }

   async delete(): Promise<boolean> {
      throw new RepositoryException('Método não implementado.');
   }
}
