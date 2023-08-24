import { ItemPedido } from 'src/enterprise/item-pedido/model';
import { IService } from 'src/enterprise/service/service';

export interface IItemPedidoService extends IService<ItemPedido> {
   save(type: ItemPedido): Promise<ItemPedido>;
   edit(type: ItemPedido): Promise<ItemPedido>;
   delete(id: number): Promise<boolean>;
}
