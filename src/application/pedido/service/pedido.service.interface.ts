import { ItemPedido } from 'src/enterprise/item-pedido/model';
import { EstadoPedido } from 'src/enterprise/pedido/enums/pedido';
import { Pedido } from 'src/enterprise/pedido/model/pedido.model';
import { IService } from 'src/enterprise/service/service';

export interface IPedidoService extends IService<Pedido> {
   save(type: Pedido): Promise<Pedido>;
   edit(type: Pedido): Promise<Pedido>;
   delete(id: number): Promise<boolean>;
   findById(id: number): Promise<Pedido>;
   findByIdEstadoDoPedido(pedidoId: number): Promise<{ estadoPedido: EstadoPedido }>;
   findAllByEstadoDoPedido(estado: EstadoPedido): Promise<Pedido[]>;
   listarPedidosPendentes(): Promise<Pedido[]>;
   listarPedidosNaoFinalizados(): Promise<Pedido[]>;
   checkout(pedido: Pedido): Promise<Pedido>;
   buscarItensPedidoPorPedidoId(pedidoId: number): Promise<ItemPedido[]>;
}
