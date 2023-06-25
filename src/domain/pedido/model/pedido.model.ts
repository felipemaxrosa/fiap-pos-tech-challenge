export class Pedido {
   constructor(
      public clienteId: number,
      public dataInicio: string,
      public estadoPedido: string,
      public ativo: boolean,
      public id?: number,
   ) {}
}
