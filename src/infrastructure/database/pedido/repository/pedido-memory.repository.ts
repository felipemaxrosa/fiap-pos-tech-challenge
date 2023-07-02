import { Injectable, Logger } from '@nestjs/common';

import { Pedido } from '../../../../domain/pedido/model/pedido.model';
import { IRepository } from '../../../../domain/repository/repository';
import { RepositoryException } from '../../../exception/repository.exception';

@Injectable()
export class PedidoMemoryRepository implements IRepository<Pedido> {
   private logger: Logger = new Logger(PedidoMemoryRepository.name);

   private pedidosRepository: Array<Pedido> = [];
   private static ID_COUNT = 0;

   async findBy(attributes: any): Promise<Pedido[]> {
      this.logger.debug(`Realizando consulta de pedidos: com os parâmetros ${JSON.stringify(attributes)}`);

      return new Promise((resolve) => {
         resolve(
            this.pedidosRepository.filter((pedido) => {
               return Object.entries(attributes).every(([key, value]) => {
                  return pedido[key] == value;
               });
            }),
         );
      });
   }

   async save(pedido: Pedido): Promise<Pedido> {
      this.logger.debug(`Criando novo pedido: ${pedido}`);

      return new Promise<Pedido>((resolve) => {
         pedido.id = ++PedidoMemoryRepository.ID_COUNT;
         this.pedidosRepository.push(pedido);
         resolve(pedido);
      });
   }

   async edit(pedido: Pedido): Promise<Pedido> {
      return new Promise<Pedido>((resolve) => {
         this.pedidosRepository[pedido.id - 1] = pedido;
         resolve(pedido);
      });
   }

   async delete(pedidoId: number): Promise<boolean> {
      return new Promise<boolean>((resolve) => {
         const pedido = this.pedidosRepository[pedidoId - 1];
         pedido.ativo = false;
         resolve(true);
      });
   }

   findAll(): Promise<Pedido[]> {
      throw new RepositoryException('Método não implementado.');
   }
}
