import { Inject, Injectable, Logger } from '@nestjs/common';
import { BuscarPedidoPorIdUseCase, EditarPedidoUseCase } from 'src/application/pedido/usecase';
import { ServiceException } from 'src/enterprise/exception/service.exception';
import { EstadoPagamento } from 'src/enterprise/pagamento/enums/pagamento.enums';
import { Pagamento } from 'src/enterprise/pagamento/model/pagamento.model';
import { EstadoPedido } from 'src/enterprise/pedido/enums/pedido';
import { Pedido } from 'src/enterprise/pedido/model/pedido.model';
import { IRepository } from 'src/enterprise/repository/repository';
import { PagamentoConstants, PedidoConstants } from 'src/shared/constants';

@Injectable()
export class WebhookPagamentoPedidoUseCase {
   private logger = new Logger(WebhookPagamentoPedidoUseCase.name);

   constructor(
      @Inject(PagamentoConstants.IREPOSITORY) private repository: IRepository<Pagamento>,
      @Inject(PedidoConstants.EDITAR_PEDIDO_USECASE)
      private editarPedidoUseCase: EditarPedidoUseCase,
      @Inject(PedidoConstants.BUSCAR_PEDIDO_POR_ID_USECASE)
      private buscarPedidoPorIdUseCase: BuscarPedidoPorIdUseCase,
   ) {}

   async webhook(transacaoId: string): Promise<boolean> {
      this.logger.log(`Webhook: ativado para transaçãoId = ${transacaoId}\n`);

      // buscar pagamento associado a transaçãoID
      const pagamento = await this.buscarPagamento(transacaoId);

      // buscar pedido associado a transaçãoID
      const pedido = await this.buscarPedido(pagamento, transacaoId);

      // mudar status pedido para RECEBIDO
      pedido.estadoPedido = EstadoPedido.RECEBIDO;
      await this.editarPedidoUseCase.editarPedido(pedido);

      // mudar status pagamento para CONFIRMADO
      pagamento.estadoPagamento = EstadoPagamento.CONFIRMADO;
      await this.repository.edit(pagamento);

      this.logger.log(`Webhook: finalizado para transaçãoId = ${transacaoId}\n`);
      return true;
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
