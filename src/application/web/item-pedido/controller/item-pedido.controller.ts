import { Body, Controller, Inject, Logger, Post, Put, Param } from '@nestjs/common';
import { ApiCreatedResponse, ApiOperation, ApiTags } from '@nestjs/swagger';

import { ItemPedido } from '../../../../domain/item-pedido/model/item-pedido.model';
import { ItemPedidoConstants } from '../../../../shared/constants';
import { IService } from 'src/domain/service/service';
import { SalvarItemPedidoRequest } from '../request';
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

   @Put(':id')
   @ApiOperation({
      summary: 'Edita um item do pedido',
      description: 'Edita um item do pedido, identificado pelo id do item vinculado ao id do pedido e id do produto',
   })
   @ApiCreatedResponse({ description: 'Item do pedido editado com sucesso' })
   async editar(@Param('id') id: number, @Body() request: ItemPedido): Promise<ItemPedido> {
      this.logger.debug(`Editando item do pedido request: ${JSON.stringify(request)}`);

      return await this.service
         .edit({
            ...request,
            id,
         })
         .then((itemPedido) => {
            this.logger.log(`Item do pedido editado com sucesso: ${itemPedido.id}`);
            return itemPedido;
         });
   }
}
