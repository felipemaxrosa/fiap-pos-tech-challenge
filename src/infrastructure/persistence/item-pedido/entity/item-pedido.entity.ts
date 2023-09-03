import { ProdutoEntity } from 'src/infrastructure/persistence/produto/entity/produto.entity';
import { Entity, Column, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

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

   @ManyToOne(() => ProdutoEntity, (produto) => produto.itensPedido)
   @JoinColumn({ name: 'PRODUTO_ID' })
   produto?: ProdutoEntity;
}
