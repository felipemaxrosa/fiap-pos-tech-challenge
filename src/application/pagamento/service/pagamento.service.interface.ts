import { EstadoPagamento } from 'src/enterprise/pagamento/enums/pagamento.enums';
import { Pagamento } from 'src/enterprise/pagamento/model/pagamento.model';
import { Pedido } from 'src/enterprise/pedido/model/pedido.model';
import { IService } from 'src/enterprise/service/service';

export interface IPagamentoService extends IService<Pagamento> {
   buscarEstadoPagamentoPedido(pedidoId: number): Promise<{ estadoPagamento: EstadoPagamento }>;
   solicitarPagamentoPedido(pedido: Pedido): Promise<Pagamento>;
}
