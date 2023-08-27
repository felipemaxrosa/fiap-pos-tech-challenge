import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class BuscarEstadoPagamentoPedidoRequest {
   @ApiProperty({ required: true, nullable: false, description: 'ID do pedido' })
   @IsNotEmpty({ message: 'ID do pedido não pode ser vazio' })
   public pedidoId: number;
}
