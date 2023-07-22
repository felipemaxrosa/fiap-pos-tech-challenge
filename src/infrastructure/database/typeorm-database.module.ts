import { Module } from '@nestjs/common';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';

import {
   CategoriaProdutoConstants,
   ItemPedidoConstants,
   PedidoConstants,
   ClienteConstants,
} from '../../shared/constants';
import { ItemPedidoEntity } from './item-pedido/entity/item-pedido.entity';
import { MysqlConfig } from './mysql/mysql.config';
import { DatabaseConstants } from './mysql/mysql.constants';
import { ClienteEntity } from './cliente/entity/cliente.entity';
import { ClienteTypeormRepository } from './cliente/repository/cliente-typeorm.repository';
import { ProdutoEntity } from './produto/entity/produto.entity';
import { ProdutoTypeormRepository } from './produto/repository/produto-typeorm.repository';
import { PedidoEntity } from './pedido/entity/pedido.entity';
import { PedidoTypeormRepository } from './pedido/repository/pedido-typeorm.repository';
import { CategoriaProdutoTypeormRepository } from './categoria/repository/categoria-produto-typeorm.repository';
import { CategoriaProdutoEntity } from './categoria/entity/categoria-produto.entity';
import { ItemPedidoTypeormRepository } from './item-pedido/repository/item-pedido-typeorm.repository';

@Module({
   imports: [
      DatabaseConstants,
      TypeOrmModule.forFeature([ClienteEntity, PedidoEntity, ProdutoEntity, ItemPedidoEntity, CategoriaProdutoEntity]),
      TypeOrmModule.forRootAsync({
         imports: [MysqlConfig],
         useFactory: async (config: TypeOrmModuleOptions) => config,
         inject: [DatabaseConstants.DATABASE_CONFIG_NAME],
      }),
   ],
   providers: [
      { provide: ClienteConstants.IREPOSITORY, useClass: ClienteTypeormRepository },
      { provide: PedidoConstants.IREPOSITORY, useClass: PedidoTypeormRepository },
      { provide: 'IRepository<Produto>', useClass: ProdutoTypeormRepository },
      { provide: CategoriaProdutoConstants.IREPOSITORY, useClass: CategoriaProdutoTypeormRepository },
      { provide: ItemPedidoConstants.IREPOSITORY, useClass: ItemPedidoTypeormRepository },
   ],
   exports: [
      { provide: ClienteConstants.IREPOSITORY, useClass: ClienteTypeormRepository },
      { provide: PedidoConstants.IREPOSITORY, useClass: PedidoTypeormRepository },
      { provide: 'IRepository<Produto>', useClass: ProdutoTypeormRepository },
      { provide: CategoriaProdutoConstants.IREPOSITORY, useClass: CategoriaProdutoTypeormRepository },
      { provide: ItemPedidoConstants.IREPOSITORY, useClass: ItemPedidoTypeormRepository },
   ],
})
export class TypeormDatabaseModule {}
