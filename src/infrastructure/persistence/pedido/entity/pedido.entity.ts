import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { ColumnNumericTransformer } from 'src/shared';
import { ItemPedidoEntity } from 'src/infrastructure/persistence/item-pedido/entity/item-pedido.entity';

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

   @Column({
      name: 'TOTAL',
      type: 'decimal',
      precision: 10,
      scale: 2,
      default: 0,
      transformer: new ColumnNumericTransformer(),
   })
   total: number;

   @OneToMany(() => ItemPedidoEntity, (itemPedido) => itemPedido.pedido)
   itensPedido?: ItemPedidoEntity[];
}
