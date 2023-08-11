import { ApiProperty } from '@nestjs/swagger';

import { EstadoPedido } from '../../../../domain/pedido/enums/pedido';
import { Pedido } from '../../../../domain/pedido/model/pedido.model';

export class ListarPedidoPendenteResponse {
   @ApiProperty({ required: true, nullable: false, description: 'ID do cliente' })
   public clienteId: number;

   @ApiProperty({ required: true, nullable: false, description: 'Data do Inicio do Pedido', pattern: 'yyyy-MM-dd' })
   public dataInicio: string;

   @ApiProperty({ required: true, nullable: false, description: 'Estado do pedido', enum: EstadoPedido })
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

   constructor(pedido: Pedido) {
      this.clienteId = pedido.clienteId;
      this.dataInicio = pedido.dataInicio;
      this.estadoPedido = pedido.estadoPedido;
      this.ativo = pedido.ativo;
      this.id = pedido.id;
   }
}
