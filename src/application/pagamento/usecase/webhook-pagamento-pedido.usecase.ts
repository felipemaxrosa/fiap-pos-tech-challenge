import { Inject, Injectable, Logger } from '@nestjs/common';
import { Pagamento } from 'src/enterprise/pagamento/model/pagamento.model';
import { IRepository } from 'src/enterprise/repository/repository';
import { PagamentoConstants } from 'src/shared/constants';

@Injectable()
export class WebhookPagamentoPedidoUseCase {
   private logger = new Logger(WebhookPagamentoPedidoUseCase.name);

   constructor(@Inject(PagamentoConstants.IREPOSITORY) private repository: IRepository<Pagamento>) {}

   async webhook(transacaoId: number): Promise<boolean> {
      this.logger.log(`\n\n\nRODRIGO: webhook activated, transaçãoId = ${transacaoId}\n\n\n`);
      return true;
      // buscar pagamento associado a transaçãoID
      // buscar pedido associado a transaçãoID
      // mudar status pagamento para CONFIRMADO
      // mudar status pedido para RECEBIDO
      // const pagamento: Pagamento = {
      //    pedidoId: pedido.id,
      //    transacaoId: transacaoId,
      //    estadoPagamento: EstadoPagamento.PENDENTE,
      //    total: pedido.total,
      //    dataHoraPagamento: new Date(),
      // };
      //
      // return await this.repository
      //    .save(pagamento)
      //    .then((pagamento) => {
      //       return pagamento;
      //    })
      //    .catch((error) => {
      //       this.logger.error(`Erro ao consultar pagamento no banco de dados: ${error} `);
      //       throw new ServiceException(`Houve um erro ao consultar o pagamento: ${error}`);
      //    });
   }
}
