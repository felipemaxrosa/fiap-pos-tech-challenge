import { ApiProperty } from '@nestjs/swagger';
import { ItemPedido } from 'src/domain/item-pedido/model';

export class SalvarItemPedidoResponse {
   @ApiProperty({ required: true, nullable: false, description: 'ID do pedido' })
   public pedidoId: number;

   @ApiProperty({ required: true, nullable: false, description: 'ID do produto' })
   public produtoId: number;

   @ApiProperty({ required: true, nullable: false, description: 'Quantidade do produto' })
   public quantidade: number;

   @ApiProperty({ required: true, nullable: false, description: 'ID do item de pedido' })
   public id: number;

   constructor(itemPedido: ItemPedido) {
      this.pedidoId = itemPedido.pedidoId;
      this.produtoId = itemPedido.produtoId;
      this.quantidade = itemPedido.quantidade;
      this.id = itemPedido.id;
   }
}
