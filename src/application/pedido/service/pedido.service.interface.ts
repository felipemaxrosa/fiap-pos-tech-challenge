import { EstadoPedido } from 'src/enterprise/pedido/enums/pedido';
import { Pedido } from 'src/enterprise/pedido/model/pedido.model';
import { IService } from 'src/enterprise/service/service';

export interface IPedidoService extends IService<Pedido> {
   findByIdEstadoDoPedido(pedidoId: number): Promise<{ estadoPedido: EstadoPedido }>;
   findAllByEstadoDoPedido(estado: EstadoPedido): Promise<Pedido[]>;
   listarPedidosPendentes(): Promise<Pedido[]>;
}
