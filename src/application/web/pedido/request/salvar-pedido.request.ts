import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsInt, IsDateString, IsBoolean, IsEnum } from 'class-validator';
import { EstadoPedido } from 'src/domain/pedido/enums/pedido';

export class SalvarPedidoRequest {
   @ApiProperty({ required: true, nullable: false, description: 'ID do cliente' })
   @IsNotEmpty({ message: 'ID do cliente não pode ser vazio' })
   @IsInt({ message: 'ID do cliente deve ser válido' })
   public clienteId: number;

   @ApiProperty({ required: true, nullable: false, description: 'Data do Inicio do Pedido' , pattern: 'yyyy-MM-dd' })
   @IsNotEmpty({ message: 'Data não pode ser vazio' })
   @IsDateString({},{message: 'Data deve ser válido'})
   public dataInicio: string;

   @ApiProperty({ required: true, nullable: false, description: 'Estado do pedido', enum: EstadoPedido})
   @IsNotEmpty({ message: 'Estado do pedido não pode ser vazio' })
   @IsEnum(EstadoPedido, {
      message: () =>
      `Estado do pedido deve ser válido: ${Object.values(EstadoPedido)
         .filter(value => typeof value === 'number')
         .map((value) => `${value}:${EstadoPedido[value]}`)
         .join(', ')}`,
   })
   public estadoPedido: EstadoPedido;

   @ApiProperty({
      required: false,
      nullable: true,
      description: 'Ativo',
      default: true,
   })
   @IsBoolean({ message: 'Ativo deve ser booleano' })
   public ativo: boolean;
}
