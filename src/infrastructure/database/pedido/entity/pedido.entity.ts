import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'PEDIDO' })
export class PedidoEntity {
   @PrimaryGeneratedColumn({ name: 'ID' })
   id: number;

   @Column({ name: 'PEDIDO_CLIENTE_ID' })
   clienteId: number;

   @Column({ name: 'ESTADO_PEDIDO' })
   estadoPedido: string;

   @Column({ name: 'DATA_INICIO' })
   dataInicio: string;
}
