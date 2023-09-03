import { Inject, Injectable, Logger } from '@nestjs/common';
import { WebhookPagamentoValidator } from 'src/application/pagamento/validation/webhook-pagamento.validator';
import { ServiceException } from 'src/enterprise/exception/service.exception';
import { ValidationException } from 'src/enterprise/exception/validation.exception';
import { EstadoPagamento } from 'src/enterprise/pagamento/enums/pagamento.enums';
import { Pagamento } from 'src/enterprise/pagamento/model/pagamento.model';
import { IRepository } from 'src/enterprise/repository/repository';
import { PagamentoConstants } from 'src/shared/constants';

@Injectable()
export class WebhookPagamentoPagamentoValidoValidator implements WebhookPagamentoValidator {
   public static PAGAMENTO_INEXISTENTE_ERROR_MESSAGE = 'Código de pagamento inexistente';
   public static PAGAMENTO_APROVADO_NAO_PODE_SER_ALTERADO_ERROR_MESSAGE =
      'Este pagamento já foi realizado com sucesso, não sendo possível alterar seu estado novamente.';

   private logger: Logger = new Logger(WebhookPagamentoPagamentoValidoValidator.name);

   constructor(@Inject(PagamentoConstants.IREPOSITORY) private repositoryPagamento: IRepository<Pagamento>) {}

   async validate(pagamentoParametro: Pagamento): Promise<boolean> {
      const pagamento = await this.buscarPagamento(pagamentoParametro.transacaoId);
      this.logger.log(
         `Inicializando validação ${WebhookPagamentoPagamentoValidoValidator.name} para verificar o estado do pagamento: ${pagamento.id}`,
      );

      await this.repositoryPagamento.findBy({ id: pagamento.id }).then((pagamentos) => {
         if (pagamentos.length === 0) {
            throw new ValidationException(WebhookPagamentoPagamentoValidoValidator.PAGAMENTO_INEXISTENTE_ERROR_MESSAGE);
         }
         if (pagamentos[0].estadoPagamento === EstadoPagamento.CONFIRMADO) {
            throw new ValidationException(
               WebhookPagamentoPagamentoValidoValidator.PAGAMENTO_APROVADO_NAO_PODE_SER_ALTERADO_ERROR_MESSAGE,
            );
         }
      });
      return true;
   }

   private async buscarPagamento(transacaoId: string): Promise<Pagamento> {
      const pagamento = await this.repositoryPagamento
         .findBy({ transacaoId: transacaoId })
         .then((pagamentos: Pagamento[]) => {
            return pagamentos[0];
         })
         .catch((error) => {
            this.logger.error(
               `Erro ao buscar pagamento associado a transação ${transacaoId} no banco de dados: ${error} `,
            );
            throw new ServiceException(
               `Erro ao buscar pagamento associado a transação ${transacaoId} no banco de dados: ${error} `,
            );
         });
      if (pagamento === undefined) {
         this.logger.error(`Nenhum pagamento associado a transação ${transacaoId} foi localizado no banco de dados`);
         throw new ServiceException(
            `Nenhum pagamento associado a transação ${transacaoId} foi localizado no banco de dados`,
         );
      }
      return pagamento;
   }
}
