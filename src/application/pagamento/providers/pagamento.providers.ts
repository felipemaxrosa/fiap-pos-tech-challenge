import { Provider } from '@nestjs/common';

import { PagamentoService } from 'src/application/pagamento/service/pagamento.service';
import {
   ConsultaEstadoPagamentoPedidoUseCase,
   SolicitaPagamentoPedidoUseCase,
} from 'src/application/pagamento/usecase';
import { WebhookPagamentoPedidoUseCase } from 'src/application/pagamento/usecase/webhook-pagamento-pedido.usecase';
import { Pagamento } from 'src/enterprise/pagamento/model/pagamento.model';
import { IRepository } from 'src/enterprise/repository/repository';
import { PagamentoConstants } from 'src/shared/constants';

export const PagamentoProviders: Provider[] = [
   {
      provide: PagamentoConstants.ISERVICE,
      useClass: PagamentoService,
   },
   {
      provide: PagamentoConstants.CONSULTA_ESTADO_PAGAMENTO_USECASE,
      inject: [PagamentoConstants.IREPOSITORY],
      useFactory: (repository: IRepository<Pagamento>): ConsultaEstadoPagamentoPedidoUseCase =>
         new ConsultaEstadoPagamentoPedidoUseCase(repository),
   },
   {
      provide: PagamentoConstants.SOLICITA_PAGAMENTO_PEDIDO_USECASE,
      inject: [PagamentoConstants.IREPOSITORY],
      useFactory: (repository: IRepository<Pagamento>): SolicitaPagamentoPedidoUseCase =>
         new SolicitaPagamentoPedidoUseCase(repository),
   },
   {
      provide: PagamentoConstants.WEBHOOK_PAGAMENTO_PEDIDO_USECASE,
      inject: [PagamentoConstants.IREPOSITORY],
      useFactory: (repository: IRepository<Pagamento>): WebhookPagamentoPedidoUseCase =>
         new WebhookPagamentoPedidoUseCase(repository),
   },
];
