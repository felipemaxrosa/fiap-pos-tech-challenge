import { Body, Controller, Get, Inject, Logger, NotFoundException, Param, Post } from '@nestjs/common';
import { ApiConsumes, ApiCreatedResponse, ApiProduces, ApiResponse, ApiTags } from '@nestjs/swagger';

import { ItemPedido } from '../../../../domain/item-pedido/model/item-pedido.model';
import { ItemPedidoConstants } from '../../../../shared/constants';
import { IService } from 'src/domain/service/service';
import { AddItemPedidoRequest } from '../request/add-item-pedido.request';

@Controller('v1/item')
@ApiTags('Item')
@ApiConsumes('application/json')
@ApiProduces('application/json')
export class ItemPedidoController {
   private logger: Logger = new Logger(ItemPedidoController.name);

   constructor(@Inject(ItemPedidoConstants.ISERVICE) private service: IService<ItemPedido>) {}

   @Post()
   @ApiCreatedResponse({ description: 'Item do pedido adicionado com sucesso' })
   async salvar(@Body() item: AddItemPedidoRequest): Promise<ItemPedido> {
      this.logger.debug(`Criando Novo Pedido Request: ${JSON.stringify(item)}`);

      return await this.service.save(item).then((itemAdicionado) => {
         this.logger.log(`Pedido gerado com sucesso: ${itemAdicionado.id}}`);
         return itemAdicionado;
      });
   }
}
