import { ItemPedido } from 'src/enterprise/item-pedido/model';
import { EstadoPedido } from 'src/enterprise/pedido/enum/estado-pedido.enum';

export class Pedido {
   constructor(
      public clienteId: number,
      public dataInicio: string,
      public estadoPedido: EstadoPedido,
      public ativo: boolean,
      public id?: number,
      public total?: number,
      public itensPedido?: ItemPedido[],
   ) {}
}
