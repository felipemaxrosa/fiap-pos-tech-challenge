import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { ColumnNumericTransformer } from 'src/shared';

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

   @Column({
      name: 'TOTAL',
      type: 'decimal',
      precision: 10,
      scale: 2,
      default: 0,
      transformer: new ColumnNumericTransformer(),
   })
   total: number;

   @Column({ name: 'DATA_HORA_PAGAMENTO' })
   dataHoraPagamento: Date;
}
