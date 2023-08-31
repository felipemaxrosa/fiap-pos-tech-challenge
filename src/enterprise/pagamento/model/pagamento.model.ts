import { EstadoPagamento } from 'src/enterprise/pagamento/enums/pagamento.enums';

export class Pagamento {
   constructor(
      public pedidoId: number,
      public transacaoId: string,
      public estadoPagamento: EstadoPagamento,
      public total: number,
      public dataHoraPagamento: Date,
      public id?: number,
   ) {}
}
