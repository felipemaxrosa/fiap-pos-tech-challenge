import { Inject, Injectable, Logger } from '@nestjs/common';
import { WebhookPagamentoValidator } from 'src/application/pagamento/validation/webhook-pagamento.validator';
import { BuscarPedidoPorIdUseCase, EditarPedidoUseCase } from 'src/application/pedido/usecase';
import { ServiceException } from 'src/enterprise/exception/service.exception';
import { ValidationException } from 'src/enterprise/exception/validation.exception';
import { EstadoPagamento, getEstadoPagamentoFromValue } from 'src/enterprise/pagamento/enums/pagamento.enums';
import { Pagamento } from 'src/enterprise/pagamento/model/pagamento.model';
import { EstadoPedido } from 'src/enterprise/pedido/enums/pedido';
import { Pedido } from 'src/enterprise/pedido/model/pedido.model';
import { IRepository } from 'src/enterprise/repository/repository';
import { PagamentoConstants, PedidoConstants } from 'src/shared/constants';
import { ValidatorUtils } from 'src/shared/validator.utils';

@Injectable()
export class WebhookPagamentoPedidoUseCase {
   private logger = new Logger(WebhookPagamentoPedidoUseCase.name);

   constructor(
      @Inject(PagamentoConstants.IREPOSITORY) private repository: IRepository<Pagamento>,
      @Inject(PedidoConstants.EDITAR_PEDIDO_USECASE)
      private editarPedidoUseCase: EditarPedidoUseCase,
      @Inject(PedidoConstants.BUSCAR_PEDIDO_POR_ID_USECASE)
      private buscarPedidoPorIdUseCase: BuscarPedidoPorIdUseCase,
      @Inject(PagamentoConstants.WEBHOOK_PAGAMENTO_VALIDATOR) private validators: WebhookPagamentoValidator[],
   ) {}

   async webhook(transacaoId: string, estadoPagamento: number): Promise<boolean> {
      this.logger.log(`Webhook: ativado para transaçãoId = ${transacaoId} para estado = ${estadoPagamento}\n`);
      const estadoPagamentoEnum: EstadoPagamento = this.constroiEstadoPagamentoEnum(estadoPagamento);
      const pagamentoParaValidar = new Pagamento(undefined, transacaoId, undefined, undefined, undefined, undefined);
      await ValidatorUtils.executeValidators(this.validators, pagamentoParaValidar);

      // buscar pagamento associado a transaçãoID
      const pagamento = await this.buscarPagamento(transacaoId);

      //TODO - validar o estadoPagamento parâmetro
      // mudar status pagamento para o estado CONFIRMADO

      pagamento.estadoPagamento = estadoPagamentoEnum;
      await this.repository.edit(pagamento);

      // mudar status pedido para RECEBIDO se o pagamento foi CONFIRMADO
      await this.mudarEstadoPedidoParaRecebidoSePagamentoConfirmado(estadoPagamentoEnum, pagamento, transacaoId);

      this.logger.log(`Webhook: finalizado para transaçãoId = ${transacaoId}\n`);
      return true;
   }

   private constroiEstadoPagamentoEnum(estadoPagamento: number): EstadoPagamento {
      const estadoPagamentoFromValue = getEstadoPagamentoFromValue(estadoPagamento);
      if (estadoPagamentoFromValue === undefined) {
         throw new ValidationException(
            `Estado de pagamento válidos são 1 (Confirmado) e 2 (Rejeitado). O estado de pagamento informado é inválido: ${estadoPagamento}`,
         );
      }
      return estadoPagamentoFromValue;
   }

   private async mudarEstadoPedidoParaRecebidoSePagamentoConfirmado(
      estadoPagamentoEnum: EstadoPagamento,
      pagamento: Pagamento,
      transacaoId: string,
   ): Promise<void> {
      if (estadoPagamentoEnum === EstadoPagamento.CONFIRMADO) {
         // buscar pedido associado a transaçãoID
         const pedido = await this.buscarPedido(pagamento, transacaoId);

         // mudar status pedido para RECEBIDO
         pedido.estadoPedido = EstadoPedido.RECEBIDO;
         await this.editarPedidoUseCase.editarPedido(pedido);
      }
   }

   private async buscarPedido(pagamento: Pagamento, transacaoId: string): Promise<Pedido> {
      const pedido = await this.buscarPedidoPorIdUseCase.buscarPedidoPorId(pagamento.pedidoId);
      if (pedido === undefined) {
         this.logger.error(`Nenhum pedido associado a transação ${transacaoId} foi localizado no banco de dados`);
         throw new ServiceException(
            `Nenhum pedido associado a transação ${transacaoId} foi localizado no banco de dados`,
         );
      }
      return pedido;
   }

   private async buscarPagamento(transacaoId: string): Promise<Pagamento> {
      const pagamento = await this.repository
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
