import { Inject, Injectable, Logger } from '@nestjs/common';
import { ServiceException } from 'src/enterprise/exception/service.exception';

import { EstadoPagamento } from 'src/enterprise/pagamento/enum/estado-pagamento.enum';
import { Pagamento } from 'src/enterprise/pagamento/model/pagamento.model';
import { PagamentoConstants } from 'src/shared/constants';
import { IRepository } from 'src/enterprise/repository/repository';

@Injectable()
export class ConsultaEstadoPagamentoPedidoUseCase {
   private logger = new Logger(ConsultaEstadoPagamentoPedidoUseCase.name);

   constructor(@Inject(PagamentoConstants.IREPOSITORY) private repository: IRepository<Pagamento>) {}

   async buscaEstadoPagamento(pedidoId: number): Promise<{ estadoPagamento: EstadoPagamento } | undefined> {
      return await this.repository
         .findBy({ pedidoId })
         .then((pagamentos) => {
            if (pagamentos.length > 0) {
               const { estadoPagamento } = pagamentos[0];
               return {
                  estadoPagamento,
               };
            }
         })
         .catch((error) => {
            this.logger.error(`Erro ao consultar pagamento no banco de dados: ${error} `);
            throw new ServiceException(`Houve um erro ao consultar o pagamento: ${error}`);
         });
   }
}
