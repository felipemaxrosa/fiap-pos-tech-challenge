import { Injectable, Logger } from '@nestjs/common';

import { ItemPedido } from '../../../../domain/item-pedido/model/item-pedido.model';
import { IRepository } from '../../../../domain/repository/repository';
import { RepositoryException } from '../../../exception/repository.exception';

@Injectable()
export class ItemPedidoMemoryRepository implements IRepository<ItemPedido> {
   private logger: Logger = new Logger(ItemPedidoMemoryRepository.name);

   private itemsPedidosRepository: Array<ItemPedido> = [];
   private static ID_COUNT = 0;

   async findBy(attributes: Partial<ItemPedido>): Promise<ItemPedido[]> {
      this.logger.debug(`Realizando consulta de items do pedido: com os parâmetros ${JSON.stringify(attributes)}`);

      return new Promise((resolve) => {
         resolve(
            this.itemsPedidosRepository.filter((pedido) =>
               Object.entries(attributes).every(([key, value]) => pedido[key] === value),
            ),
         );
      });
   }

   async save(itemPedido: ItemPedido): Promise<ItemPedido> {
      this.logger.debug(`Adicionando item no pedido: ${itemPedido}`);

      return new Promise<ItemPedido>((resolve) => {
         itemPedido.id = ++ItemPedidoMemoryRepository.ID_COUNT;
         this.itemsPedidosRepository.push(itemPedido);
         resolve(itemPedido);
      });
   }

   async edit(itemPedido: ItemPedido): Promise<ItemPedido> {
      return new Promise<ItemPedido>((resolve) => {
         this.itemsPedidosRepository[itemPedido.id - 1] = itemPedido;
         resolve(itemPedido);
      });
   }

   async delete(itemPedidoId: number): Promise<boolean> {
      return new Promise<boolean>((resolve) => {
         this.itemsPedidosRepository.splice(itemPedidoId - 1);
         resolve(true);
      });
   }

   findAll(): Promise<ItemPedido[]> {
      throw new RepositoryException('Método não implementado.');
   }
}
