import { Controller, Get, Inject, Logger, NotFoundException, Param, Post, Query, ValidationPipe } from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { IPagamentoService } from 'src/application/pagamento/service/pagamento.service.interface';
import { BaseRestApi } from 'src/presentation/rest/base.api';
import { BuscarEstadoPagamentoPedidoRequest } from 'src/presentation/rest/pagamento/request';
import { BuscarEstadoPagamentoPedidoResponse } from 'src/presentation/rest/pagamento/response';
import { PagamentoConstants } from 'src/shared/constants';

@Controller('v1/pagamento')
@ApiTags('Pagamento')
export class PagamentoRestApi extends BaseRestApi {
   private logger: Logger = new Logger(PagamentoRestApi.name);

   constructor(@Inject(PagamentoConstants.ISERVICE) private service: IPagamentoService) {
      super();
   }

   @Post(':transacaoId/:estadoPagamento')
   @ApiOperation({
      summary: 'Webhook para atualização do estado do pagamento de um pedido com APROVADO = 1, REJEITADO =2',
      description: 'Confirma o pagamento de um pedido através da integração com o gateway de pagamento.',
   })
   @ApiOkResponse({
      description: 'Pagamento confirmado com sucesso',
   })
   async webhook(
      @Param('transacaoId') transacaoId: string,
      @Param('estadoPagamento') estadoPagamento: number,
   ): Promise<boolean> {
      const response = await this.service.webhookPagamentoPedido(transacaoId, estadoPagamento);
      this.logger.debug(`Estado do pagamento modificado para ${estadoPagamento} para a transactionId  ${transacaoId}.`);
      return response;
   }

   @Get('estado')
   @ApiOperation({
      summary: 'Consulta estado do pagamento por ID do Pedido com PENDENTE = 0, CONFIRMADO = 1 e REJEITADO = 2',
      description: 'Realiza consulta do estado do pagamento por ID do Pedido',
   })
   @ApiOkResponse({
      description: 'Estado do pagamento consultado com sucesso',
      type: BuscarEstadoPagamentoPedidoResponse,
   })
   async buscarPorPedidoId(
      @Query(ValidationPipe) query: BuscarEstadoPagamentoPedidoRequest,
   ): Promise<BuscarEstadoPagamentoPedidoResponse> {
      this.logger.debug(`Consultando estado do pagamento por ID do pedido: ${query}`);
      return await this.service.buscarEstadoPagamentoPedido(query.pedidoId).then((pagamento) => {
         if (pagamento === undefined) {
            throw new NotFoundException('Pagamento para o pedido não encontrado');
         }

         return new BuscarEstadoPagamentoPedidoResponse(pagamento);
      });
   }
}
