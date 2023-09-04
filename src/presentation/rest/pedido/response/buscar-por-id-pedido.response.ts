import { ApiProperty } from '@nestjs/swagger';
import { ItemPedido } from 'src/enterprise/item-pedido/model';
import { EstadoPedido } from 'src/enterprise/pedido/enum/estado-pedido.enum';
import { Pedido } from 'src/enterprise/pedido/model/pedido.model';

export class BuscarPorIdPedidoResponse {
   @ApiProperty({ required: true, nullable: false, description: 'ID do cliente' })
   public clienteId: number;

   @ApiProperty({ required: true, nullable: false, description: 'Data do Inicio do Pedido', pattern: 'yyyy-MM-dd' })
   public dataInicio: string;

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

   @ApiProperty({
      required: false,
      nullable: true,
      description: 'Ativo',
      default: true,
   })
   public ativo: boolean;

   @ApiProperty({ required: true, nullable: false, description: 'ID do pedido' })
   public id: number;

   @ApiProperty({ required: false, nullable: true, description: 'Itens de pedido', type: ItemPedido, isArray: true })
   public itensPedido: ItemPedido[];

   constructor(pedido: Pedido) {
      this.clienteId = pedido.clienteId;
      this.dataInicio = pedido.dataInicio;
      this.estadoPedido = pedido.estadoPedido;
      this.ativo = pedido.ativo;
      this.id = pedido.id;
      this.itensPedido = pedido.itensPedido;
   }
}
