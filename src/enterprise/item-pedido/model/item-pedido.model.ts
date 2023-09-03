import { Produto } from 'src/enterprise/produto/model/produto.model';

export class ItemPedido {
   constructor(
      public pedidoId: number,
      public produtoId: number,
      public quantidade: number,
      public id?: number,
      produto?: Produto,
   ) {}
}
