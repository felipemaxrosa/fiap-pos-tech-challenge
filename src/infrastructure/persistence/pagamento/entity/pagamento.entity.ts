import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'PAGAMENTO' })
export class PagamentoEntity {
   @PrimaryGeneratedColumn({ name: 'ID' })
   id: number;

   @Column({ name: 'PEDIDO_ID' })
   pedidoId: number;

   @Column({ name: 'TRANSACAO_ID' })
   transacaoId: string;

   @Column({ name: 'ESTADO_PAGAMENTO' })
   estadoPagamento: number;

   @Column({ name: 'TOTAL' })
   total: number;

   @Column({ name: 'DATA_HORA_PAGAMENTO' })
   dataHoraPagamento: Date;
}
