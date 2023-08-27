import { Inject, Injectable } from '@nestjs/common';
import { IPagamentoService } from 'src/application/pagamento/service/pagamento.service.interface';
import { EstadoPagamento } from 'src/enterprise/pagamento/enums/pagamento.enums';
import { PagamentoConstants } from 'src/shared/constants';
import { ConsultaEstadoPagamentoPedidoUseCase } from 'src/application/pagamento/usecase';

@Injectable()
export class PagamentoService implements IPagamentoService {
   constructor(
      @Inject(PagamentoConstants.CONSULTA_ESTADO_PAGAMENTO_USECASE)
      private consultaEstadoUsecase: ConsultaEstadoPagamentoPedidoUseCase,
   ) {}

   async buscarEstadoPagamentoPedido(pedidoId: number): Promise<{ estadoPagamento: EstadoPagamento }> {
      return await this.consultaEstadoUsecase.buscaEstadoPagamento(pedidoId);
   }
}
