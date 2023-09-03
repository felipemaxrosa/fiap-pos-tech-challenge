import { Inject, Injectable, Logger } from '@nestjs/common';
import { WebhookPagamentoValidator } from 'src/application/pagamento/validation/webhook-pagamento.validator';
import { BuscarPedidoPorIdUseCase } from 'src/application/pedido/usecase';
import { ServiceException } from 'src/enterprise/exception/service.exception';
import { ValidationException } from 'src/enterprise/exception/validation.exception';
import { Pagamento } from 'src/enterprise/pagamento/model/pagamento.model';
import { EstadoPedido } from 'src/enterprise/pedido/enums/pedido';
import { Pedido } from 'src/enterprise/pedido/model/pedido.model';
import { IRepository } from 'src/enterprise/repository/repository';
import { PagamentoConstants, PedidoConstants } from 'src/shared/constants';

@Injectable()
export class WebhookPagamentoPedidoValidoValidator implements WebhookPagamentoValidator {
   public static PEDIDO_INEXISTENTE_ERROR_MESSAGE = 'Código de pedido inexistente';
   public static PEDIDO_JA_PAGO_ERROR_MESSAGE =
      'O pedido já foi pago, não sendo possível alterar seu estado novamente.';

   private logger: Logger = new Logger(WebhookPagamentoPedidoValidoValidator.name);

   constructor(
      @Inject(PedidoConstants.IREPOSITORY) private repositoryPedido: IRepository<Pedido>,
      @Inject(PagamentoConstants.IREPOSITORY) private repositoryPagamento: IRepository<Pagamento>,
      @Inject(PedidoConstants.BUSCAR_PEDIDO_POR_ID_USECASE)
      private buscarPedidoPorIdUseCase: BuscarPedidoPorIdUseCase,
   ) {}

   async validate(pagamentoParametro: Pagamento): Promise<boolean> {
      const pagamento = await this.buscarPagamento(pagamentoParametro.transacaoId);
      const pedido = await this.buscarPedido(pagamento);
      this.logger.log(
         `Inicializando validação ${WebhookPagamentoPedidoValidoValidator.name} para validar o estado do pedido id: ${pedido.id}`,
      );

      await this.repositoryPedido.findBy({ id: pedido.id }).then((pedidos) => {
         if (pedidos.length === 0) {
            throw new ValidationException(WebhookPagamentoPedidoValidoValidator.PEDIDO_INEXISTENTE_ERROR_MESSAGE);
         }
         if (pedidos[0].estadoPedido !== EstadoPedido.PAGAMENTO_PENDENTE) {
            this.logger.debug(`O estado do pedido precisa ser PAGAMENTO_PENDENTE, mas é ${pedidos[0].estadoPedido}`);
            throw new ValidationException(WebhookPagamentoPedidoValidoValidator.PEDIDO_JA_PAGO_ERROR_MESSAGE);
         }
      });
      return true;
   }

   private async buscarPedido(pagamento: Pagamento): Promise<Pedido> {
      const pedido = await this.buscarPedidoPorIdUseCase.buscarPedidoPorId(pagamento.pedidoId);
      if (pedido === undefined) {
         this.logger.error(
            `Nenhum pedido associado a transação ${pagamento.transacaoId} foi localizado no banco de dados`,
         );
         throw new ServiceException(
            `Nenhum pedido associado a transação ${pagamento.transacaoId} foi localizado no banco de dados`,
         );
      }
      return pedido;
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
