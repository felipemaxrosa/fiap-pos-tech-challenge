import { IRepository } from 'src/domain/repository/repository';
import { Pedido } from '../model/pedido.model';

export interface IPedidoRepository extends IRepository<Pedido> {
   listarPedidosPendentes(): Promise<Pedido[]>;
}
