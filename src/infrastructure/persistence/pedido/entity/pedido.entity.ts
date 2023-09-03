import { ItemPedidoEntity } from 'src/infrastructure/persistence/item-pedido/entity/item-pedido.entity';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'PEDIDO' })
export class PedidoEntity {
   @PrimaryGeneratedColumn({ name: 'ID' })
   id: number;

   @Column({ name: 'PEDIDO_CLIENTE_ID' })
   clienteId: number;

   @Column({ name: 'ESTADO_PEDIDO' })
   estadoPedido: number;

   @Column({ name: 'DATA_INICIO' })
   dataInicio: string;

   @Column({ name: 'ATIVO' })
   ativo: boolean;

   @Column({ name: 'TOTAL' })
   total: number;

   @OneToMany(() => ItemPedidoEntity, (itemPedido) => itemPedido.produto)
   itensPedido?: ItemPedidoEntity[];
}
