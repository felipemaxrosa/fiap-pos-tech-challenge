import {
   Inject,
   Controller,
   Logger,
   Param,
   ParseIntPipe,
   Post,
   Get,
   Query,
   ValidationPipe,
   NotFoundException,
} from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { IPagamentoService } from 'src/application/pagamento/service/pagamento.service.interface';
import { BaseRestApi } from 'src/presentation/rest/base.api';
import { PagamentoConstants } from 'src/shared/constants';
import { BuscarEstadoPagamentoPedidoResponse } from 'src/presentation/rest/pagamento/response';
import { BuscarEstadoPagamentoPedidoRequest } from 'src/presentation/rest/pagamento/request';
@Controller('v1/pagamento')
@ApiTags('Pagamento')
export class PagamentoRestApi extends BaseRestApi {
   private logger: Logger = new Logger(PagamentoRestApi.name);

   constructor(@Inject(PagamentoConstants.ISERVICE) private service: IPagamentoService) {
      super();
   }

   @Post(':id')
   @ApiOperation({
      summary: 'Realiza o pagamento de um pedido',
      description:
         'Realiza o pagamento de um pedido. Neste momento, ainda não há implementação da integração com o gateway de pagamento.',
   })
   @ApiOkResponse({
      description: 'Pagamento realizado com sucesso',
   })
   async pagar(@Param('id', ParseIntPipe) id: number): Promise<boolean> {
      this.logger.debug('Pagamento realizado com sucesso para o pedido ' + id + '.');
      return Promise.resolve(true);
   }

   @Get('estado')
   @ApiOperation({
      summary: 'Consulta estado do pagamento por ID do Pedido',
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
