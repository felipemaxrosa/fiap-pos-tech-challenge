import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsInt, IsString } from 'class-validator';

export class CriarNovoPedidoRequest {
   @ApiProperty({ required: true, nullable: false, description: 'ID do cliente' })
   @IsNotEmpty({ message: 'ID do cliente não pode ser vazio' })
   @IsInt({ message: 'ID do cliente deve ser válido' })
   public clienteId: number;

   @ApiProperty({ required: true, nullable: false, description: 'Data do Inicio do Pedido' })
   @IsNotEmpty({ message: 'Data não pode ser vazio' })
   @IsString({ message: 'Data deve ser válido' })
   public dataInicio: string;

   @ApiProperty({ required: true, nullable: false, description: 'Estado do pedido' })
   @IsNotEmpty({ message: 'Estado do pedido não pode ser vazio' })
   @IsInt({ message: 'Estado do pedido deve ser válido' })
   public estadoPedido: number;

   @ApiProperty({
      required: false,
      nullable: true,
      description: 'Ativo',
      default: true,
   })
   //@IsBoolean({ message: 'Ativo deve ser booleano' })
   public ativo: boolean;
}
