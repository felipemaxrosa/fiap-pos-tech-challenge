import { ApiProperty } from '@nestjs/swagger';
import { SalvarItemPedidoRequest } from 'src/presentation/web/item-pedido/request/salvar-item-pedido.request';

export class EditarItemPedidoRequest extends SalvarItemPedidoRequest {
   @ApiProperty({ required: true, nullable: false, description: 'Id do Item do Pedido' })
   readonly id: number;
}
