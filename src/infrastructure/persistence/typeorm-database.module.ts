import { Module } from '@nestjs/common';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';
import { CategoriaProdutoEntity } from 'src/infrastructure/persistence/categoria/entity/categoria-produto.entity';
import { ClienteEntity } from 'src/infrastructure/persistence/cliente/entity/cliente.entity';
import { ItemPedidoEntity } from 'src/infrastructure/persistence/item-pedido/entity/item-pedido.entity';
import { MysqlConfig } from 'src/infrastructure/persistence/mysql/mysql.config';
import { DatabaseConstants } from 'src/infrastructure/persistence/mysql/mysql.constants';
import { PedidoEntity } from 'src/infrastructure/persistence/pedido/entity/pedido.entity';
import { ProdutoEntity } from 'src/infrastructure/persistence/produto/entity/produto.entity';
import { PersistenceTypeOrmProviders } from 'src/infrastructure/persistence/providers/persistence-typeorm.providers';

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
   providers: [...PersistenceTypeOrmProviders],
   exports: [...PersistenceTypeOrmProviders],
})
export class TypeormDatabaseModule {}
