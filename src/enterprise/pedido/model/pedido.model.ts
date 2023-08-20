import { EstadoPedido } from "src/enterprise/pedido/enums/pedido";

export class Pedido {
   constructor(
      public clienteId: number,
      public dataInicio: string,
      public estadoPedido: EstadoPedido,
      public ativo: boolean,
      public id?: number,
   ) {}
}
