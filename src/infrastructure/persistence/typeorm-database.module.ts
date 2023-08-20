import { Module } from '@nestjs/common';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';
import { CategoriaProdutoEntity } from 'src/infrastructure/persistence/categoria/entity/categoria-produto.entity';
import { CategoriaProdutoTypeormRepository } from 'src/infrastructure/persistence/categoria/repository/categoria-produto-typeorm.repository';
import { ClienteEntity } from 'src/infrastructure/persistence/cliente/entity/cliente.entity';
import { ClienteTypeormRepository } from 'src/infrastructure/persistence/cliente/repository/cliente-typeorm.repository';
import { ItemPedidoEntity } from 'src/infrastructure/persistence/item-pedido/entity/item-pedido.entity';
import { ItemPedidoTypeormRepository } from 'src/infrastructure/persistence/item-pedido/repository/item-pedido-typeorm.repository';
import { MysqlConfig } from 'src/infrastructure/persistence/mysql/mysql.config';
import { DatabaseConstants } from 'src/infrastructure/persistence/mysql/mysql.constants';
import { PedidoEntity } from 'src/infrastructure/persistence/pedido/entity/pedido.entity';
import { PedidoTypeormRepository } from 'src/infrastructure/persistence/pedido/repository/pedido-typeorm.repository';
import { ProdutoEntity } from 'src/infrastructure/persistence/produto/entity/produto.entity';
import { ProdutoTypeormRepository } from 'src/infrastructure/persistence/produto/repository/produto-typeorm.repository';
import { ClienteConstants, PedidoConstants, ProdutoConstants, CategoriaProdutoConstants, ItemPedidoConstants } from 'src/shared/constants';

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
      { provide: ProdutoConstants.IREPOSITORY, useClass: ProdutoTypeormRepository },
      { provide: CategoriaProdutoConstants.IREPOSITORY, useClass: CategoriaProdutoTypeormRepository },
      { provide: ItemPedidoConstants.IREPOSITORY, useClass: ItemPedidoTypeormRepository },
   ],
   exports: [
      { provide: ClienteConstants.IREPOSITORY, useClass: ClienteTypeormRepository },
      { provide: PedidoConstants.IREPOSITORY, useClass: PedidoTypeormRepository },
      { provide: ProdutoConstants.IREPOSITORY, useClass: ProdutoTypeormRepository },
      { provide: CategoriaProdutoConstants.IREPOSITORY, useClass: CategoriaProdutoTypeormRepository },
      { provide: ItemPedidoConstants.IREPOSITORY, useClass: ItemPedidoTypeormRepository },
   ],
})
export class TypeormDatabaseModule {}
