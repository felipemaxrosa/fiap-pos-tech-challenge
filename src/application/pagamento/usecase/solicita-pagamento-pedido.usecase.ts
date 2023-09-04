import { Inject, Injectable, Logger } from '@nestjs/common';
import { ServiceException } from 'src/enterprise/exception/service.exception';
import { EstadoPagamento } from 'src/enterprise/pagamento/enum/estado-pagamento.enum';
import { Pagamento } from 'src/enterprise/pagamento/model/pagamento.model';
import { Pedido } from 'src/enterprise/pedido/model/pedido.model';
import { IRepository } from 'src/enterprise/repository/repository';
import { PagamentoConstants } from 'src/shared/constants';
import { RandomIdGeneratorUtils } from 'src/shared/random.id.generator.utils';

@Injectable()
export class SolicitaPagamentoPedidoUseCase {
   private logger = new Logger(SolicitaPagamentoPedidoUseCase.name);

   constructor(@Inject(PagamentoConstants.IREPOSITORY) private repository: IRepository<Pagamento>) {}

   async solicitaPagamento(pedido: Pedido): Promise<Pagamento> {
      const transacaoId = RandomIdGeneratorUtils.generate('transacaoId', pedido.id);
      const pagamento: Pagamento = {
         pedidoId: pedido.id,
         transacaoId: transacaoId,
         estadoPagamento: EstadoPagamento.PENDENTE,
         total: pedido.total,
         dataHoraPagamento: undefined,
      };
      return await this.repository
         .save(pagamento)
         .then((pagamento) => {
            return pagamento;
         })
         .catch((error) => {
            this.logger.error(`Erro ao consultar pagamento no banco de dados: ${error} `);
            throw new ServiceException(`Houve um erro ao consultar o pagamento: ${error}`);
         });
   }
}
