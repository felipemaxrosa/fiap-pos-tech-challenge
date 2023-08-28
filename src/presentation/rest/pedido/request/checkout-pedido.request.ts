import { ApiProperty } from '@nestjs/swagger';

export class CheckoutPedidoRequest {
   @ApiProperty({ required: true, nullable: false, description: 'Id pedido' })
   readonly id: number;
}
