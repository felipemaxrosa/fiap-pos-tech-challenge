import { EstadoPagamento } from 'src/enterprise/pagamento/enums/pagamento.enums';

export class Pagamento {
   constructor(
      public pedidoId: number,
      public transacaoId: number,
      estadoPagamento: EstadoPagamento,
      total: number,
      dataHoraPagamento: Date,
      public id?: number,
   ) {}
}
