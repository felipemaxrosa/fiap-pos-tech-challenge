import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'ITEMS_PEDIDO' })
export class ItemsPedidoEntity {
   @PrimaryGeneratedColumn({ name: 'ID' })
   id: number;

   @Column({ name: 'PEDIDO_ID' })
   pedidoId: number;

   @Column({ name: 'PRODUTO_ID' })
   produtoId: number;

   @Column({ name: 'QUANTIDADE' })
   quantidade: number;
}
