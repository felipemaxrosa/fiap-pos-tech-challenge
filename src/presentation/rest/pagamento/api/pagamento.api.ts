import { Controller, Logger, Param, ParseIntPipe, Post } from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { BaseRestApi } from 'src/presentation/rest/base.api';

@Controller('v1/pagamento')
@ApiTags('Pagamento')
export class PagamentoRestApi extends BaseRestApi {
   private logger: Logger = new Logger(PagamentoRestApi.name);

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
}
