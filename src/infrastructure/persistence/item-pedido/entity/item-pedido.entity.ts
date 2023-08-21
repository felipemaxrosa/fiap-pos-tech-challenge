import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'ITEM_PEDIDO' })
export class ItemPedidoEntity {
   @PrimaryGeneratedColumn({ name: 'ID' })
   id: number;

   @Column({ name: 'PEDIDO_ID' })
   pedidoId: number;

   @Column({ name: 'PRODUTO_ID' })
   produtoId: number;

   @Column({ name: 'QUANTIDADE' })
   quantidade: number;
}
