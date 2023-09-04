import { ApiProperty } from '@nestjs/swagger';
import { EstadoPedido } from 'src/enterprise/pedido/enum/estado-pedido.enum';

export class BuscarPorIdEstadoPedidoResponse {
   @ApiProperty({
      required: true,
      nullable: false,
      enum: EstadoPedido,
      description: `${Object.values(EstadoPedido)
         .filter((value) => typeof value === 'number')
         .map((value) => `${value}:${EstadoPedido[value]}`)
         .join(', ')}`,
   })
   public estadoPedido: EstadoPedido;

   constructor(estadoPedido: EstadoPedido) {
      this.estadoPedido = estadoPedido;
   }
}
