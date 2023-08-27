import { Provider } from '@nestjs/common';

import { PagamentoService } from 'src/application/pagamento/service/pagamento.service';
import { IRepository } from 'src/enterprise/repository/repository';
import { PagamentoConstants } from 'src/shared/constants';
import { ConsultaEstadoPagamentoPedidoUseCase } from 'src/application/pagamento/usecase';
import { Pagamento } from 'src/enterprise/pagamento/model/pagamento.model';

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
];
