import { ApiProperty } from '@nestjs/swagger';
import { EstadoPedido } from 'src/enterprise/pedido/enums/pedido';

export class BuscarPorIdEstadoPedidoResponse {
   @ApiProperty({ required: true, nullable: false, description: 'Estado do pedido', enum: EstadoPedido })
   public estadoPedido: EstadoPedido;

   constructor(estadoPedido: EstadoPedido) {
      this.estadoPedido = estadoPedido;
   }
}
