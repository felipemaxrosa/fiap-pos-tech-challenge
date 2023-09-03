import { Inject, Injectable, Logger } from '@nestjs/common';
import { WebhookPagamentoValidator } from 'src/application/pagamento/validation/webhook-pagamento.validator';
import { ValidationException } from 'src/enterprise/exception/validation.exception';
import { Pagamento } from 'src/enterprise/pagamento/model/pagamento.model';
import { IRepository } from 'src/enterprise/repository/repository';
import { PagamentoConstants } from 'src/shared/constants';

@Injectable()
export class WebhookPagamentoTransacaoIdValidoValidator implements WebhookPagamentoValidator {
   public static TRANSACAO_INEXISTENTE_ERROR_MESSAGE = 'Código de transação inexistente';

   private logger: Logger = new Logger(WebhookPagamentoTransacaoIdValidoValidator.name);

   constructor(@Inject(PagamentoConstants.IREPOSITORY) private repositoryPagamento: IRepository<Pagamento>) {}

   async validate(pagamento: Pagamento): Promise<boolean> {
      const transacaoId = pagamento.transacaoId;
      this.logger.log(
         `Inicializando validação ${WebhookPagamentoTransacaoIdValidoValidator.name} para acionar o webhook para a transação com id: ${transacaoId}`,
      );

      await this.repositoryPagamento.findBy({ transacaoId: transacaoId }).then((pagamentos) => {
         if (pagamentos.length === 0) {
            throw new ValidationException(
               WebhookPagamentoTransacaoIdValidoValidator.TRANSACAO_INEXISTENTE_ERROR_MESSAGE,
            );
         }
      });

      return true;
   }
}
