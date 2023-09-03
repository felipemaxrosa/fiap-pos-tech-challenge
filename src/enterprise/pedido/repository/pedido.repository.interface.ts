import { Pedido } from 'src/enterprise/pedido/model/pedido.model';
import { IRepository } from 'src/enterprise/repository/repository';

export interface IPedidoRepository extends IRepository<Pedido> {
   listarPedidosPendentes(): Promise<Pedido[]>;
   find(options: any): Promise<Pedido[]>;
}
