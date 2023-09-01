import { Provider } from '@nestjs/common';

import { PagamentoService } from 'src/application/pagamento/service/pagamento.service';
import {
   ConsultaEstadoPagamentoPedidoUseCase,
   SolicitaPagamentoPedidoUseCase,
} from 'src/application/pagamento/usecase';
import { WebhookPagamentoPedidoUseCase } from 'src/application/pagamento/usecase/webhook-pagamento-pedido.usecase';
import { BuscarPedidoPorIdUseCase, EditarPedidoUseCase } from 'src/application/pedido/usecase';
import { Pagamento } from 'src/enterprise/pagamento/model/pagamento.model';
import { IRepository } from 'src/enterprise/repository/repository';
import { PagamentoConstants, PedidoConstants } from 'src/shared/constants';

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
      inject: [
         PagamentoConstants.IREPOSITORY,
         PedidoConstants.BUSCAR_PEDIDO_POR_ID_USECASE,
         PedidoConstants.EDITAR_PEDIDO_USECASE,
      ],
      useFactory: (
         repository: IRepository<Pagamento>,
         buscarPedidoPorIdUseCase: BuscarPedidoPorIdUseCase,
         editarPedidoUseCase: EditarPedidoUseCase,
      ): WebhookPagamentoPedidoUseCase =>
         new WebhookPagamentoPedidoUseCase(repository, buscarPedidoPorIdUseCase, editarPedidoUseCase),
   },
];
