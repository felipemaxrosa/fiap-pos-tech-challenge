import { Provider } from '@nestjs/common';

import { PagamentoService } from 'src/application/pagamento/service/pagamento.service';
import {
   ConsultaEstadoPagamentoPedidoUseCase,
   SolicitaPagamentoPedidoUseCase,
} from 'src/application/pagamento/usecase';
import { WebhookPagamentoPedidoUseCase } from 'src/application/pagamento/usecase/webhook-pagamento-pedido.usecase';
import { WebhookPagamentoPagamentoValidoValidator } from 'src/application/pagamento/validation/webhook-pagamento-pagamento-valido-validator.service';
import { WebhookPagamentoPedidoValidoValidator } from 'src/application/pagamento/validation/webhook-pagamento-pedido-valido-validator.service';
import { WebhookPagamentoTransacaoIdValidoValidator } from 'src/application/pagamento/validation/webhook-pagamento-transacao-id-valido.validator';
import { WebhookPagamentoValidator } from 'src/application/pagamento/validation/webhook-pagamento.validator';
import { BuscarPedidoPorIdUseCase, EditarPedidoUseCase } from 'src/application/pedido/usecase';
import { Pagamento } from 'src/enterprise/pagamento/model/pagamento.model';
import { Pedido } from 'src/enterprise/pedido/model/pedido.model';
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
         PedidoConstants.EDITAR_PEDIDO_USECASE,
         PedidoConstants.BUSCAR_PEDIDO_POR_ID_USECASE,
         PagamentoConstants.WEBHOOK_PAGAMENTO_VALIDATOR,
      ],
      useFactory: (
         repository: IRepository<Pagamento>,
         editarPedidoUseCase: EditarPedidoUseCase,
         buscarPedidoPorIdUseCase: BuscarPedidoPorIdUseCase,
         validators: WebhookPagamentoValidator[],
      ): WebhookPagamentoPedidoUseCase =>
         new WebhookPagamentoPedidoUseCase(repository, editarPedidoUseCase, buscarPedidoPorIdUseCase, validators),
   },
   {
      provide: PagamentoConstants.WEBHOOK_PAGAMENTO_VALIDATOR,
      inject: [PagamentoConstants.IREPOSITORY, PedidoConstants.IREPOSITORY],
      useFactory: (
         repositoryPagamento: IRepository<Pagamento>,
         repositoryPedido: IRepository<Pedido>,
      ): WebhookPagamentoValidator[] => [
         new WebhookPagamentoTransacaoIdValidoValidator(repositoryPagamento),
         new WebhookPagamentoPedidoValidoValidator(repositoryPedido),
         new WebhookPagamentoPagamentoValidoValidator(repositoryPagamento),
      ],
   },
];
