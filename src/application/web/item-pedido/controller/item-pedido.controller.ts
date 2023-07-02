import { Body, Controller, Inject, Logger, Post } from '@nestjs/common';
import { ApiCreatedResponse, ApiOperation, ApiTags } from '@nestjs/swagger';

import { ItemPedido } from '../../../../domain/item-pedido/model/item-pedido.model';
import { ItemPedidoConstants } from '../../../../shared/constants';
import { IService } from 'src/domain/service/service';
import { SalvarItemPedidoRequest as SalvarItemPedidoRequest } from '../request/salvar-item-pedido.request';
import { BaseController } from '../../base.controller';
import { SalvarItemPedidoResponse } from '../request/salvar-item-pedido.response';

@Controller('v1/item')
@ApiTags('Item')
export class ItemPedidoController extends BaseController {
   private logger: Logger = new Logger(ItemPedidoController.name);

   constructor(@Inject(ItemPedidoConstants.ISERVICE) private service: IService<ItemPedido>) {
      super();
   }

   @Post()
   @ApiOperation({
      summary: 'Adiciona um novo item de pedido',
      description: 'Adiciona um novo item de pedido, identificado pelo id produto, id do pedido e quantidade',
   })
   @ApiCreatedResponse({ description: 'Item do pedido adicionado com sucesso', type: SalvarItemPedidoResponse })
   async salvar(@Body() item: SalvarItemPedidoRequest): Promise<SalvarItemPedidoResponse> {
      this.logger.debug(`Criando Novo Pedido Request: ${JSON.stringify(item)}`);

      return await this.service.save(item).then((itemAdicionado) => {
         this.logger.log(`Pedido gerado com sucesso: ${itemAdicionado.id}}`);
         return new SalvarItemPedidoResponse(itemAdicionado);
      });
   }
}
