import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsInt } from 'class-validator';

export class AddItemPedidoRequest {
   @ApiProperty({ required: true, nullable: false, description: 'ID do pedido' })
   @IsNotEmpty({ message: 'ID do pedido não pode ser vazio' })
   @IsInt({ message: 'ID do pedido deve ser válido' })
   public pedidoId: number;

   @ApiProperty({ required: true, nullable: false, description: 'ID do produto' })
   @IsNotEmpty({ message: 'ID do produto não pode ser vazio' })
   @IsInt({ message: 'ID do produto deve ser válido' })
   public produtoId: number;

   @ApiProperty({ required: true, nullable: false, description: 'Quantidade do produto' })
   @IsNotEmpty({ message: 'Quantidade do produto não pode ser vazio' })
   @IsInt({ message: 'Quantidade do produto deve ser válido' })
   public quantidade: number;
}
