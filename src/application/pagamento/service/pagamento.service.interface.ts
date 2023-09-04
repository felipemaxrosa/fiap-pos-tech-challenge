import { EstadoPagamento } from 'src/enterprise/pagamento/enum/estado-pagamento.enum';
import { Pagamento } from 'src/enterprise/pagamento/model/pagamento.model';
import { Pedido } from 'src/enterprise/pedido/model/pedido.model';
import { IService } from 'src/enterprise/service/service';

export interface IPagamentoService extends IService<Pagamento> {
   buscarEstadoPagamentoPedido(pedidoId: number): Promise<{ estadoPagamento: EstadoPagamento }>;
   solicitarPagamentoPedido(pedido: Pedido): Promise<Pagamento>;
   webhookPagamentoPedido(transacaoId: string, estadoPagamento: number): Promise<boolean>;
}
