import { Module } from '@nestjs/common';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';

import { MysqlConfg } from './mysql/mysql.config';
import { DatabaseConstants } from './mysql/mysql.constants';
import { ClienteEntity } from './cliente/entity/cliente.entity';
import { ClienteTypeormRepository } from './cliente/repository/cliente-typeorm.repository';
import { ProdutoEntity } from './produto/entity/produto.entity';
import { ProdutoTypeormRepository } from './produto/repository/produto-typeorm.repository';
import { PedidoConstants } from 'src/shared/constants';
import { PedidoEntity } from './pedido/entity/pedido.entity';
import { PedidoTypeormRepository } from './pedido/repository/pedido-typeorm.repository';
import { CategoriaProdutoTypeormRepository } from './categoria/repository/categoria-produto-typeorm.repository';
import { CategoriaProdutoEntity } from './categoria/entity/categoria-produto.entity';

@Module({
   imports: [
      DatabaseConstants,
      TypeOrmModule.forFeature([ClienteEntity, PedidoEntity, ProdutoEntity, CategoriaProdutoEntity]),
      TypeOrmModule.forRootAsync({
         imports: [MysqlConfg],
         useFactory: async (config: TypeOrmModuleOptions) => config,
         inject: [DatabaseConstants.DATABASE_CONFIG_NAME],
      }),
   ],
   providers: [
      { provide: 'IRepository<Cliente>', useClass: ClienteTypeormRepository },
      { provide: PedidoConstants.IREPOSITORY, useClass: PedidoTypeormRepository },
      { provide: 'IRepository<Produto>', useClass: ProdutoTypeormRepository },
      { provide: 'IRepository<CategoriaProduto>', useClass: CategoriaProdutoTypeormRepository },
   ],
   exports: [
      { provide: 'IRepository<Cliente>', useClass: ClienteTypeormRepository },
      { provide: PedidoConstants.IREPOSITORY, useClass: PedidoTypeormRepository },
      { provide: 'IRepository<Produto>', useClass: ProdutoTypeormRepository },
      { provide: 'IRepository<CategoriaProduto>', useClass: CategoriaProdutoTypeormRepository },
   ],
})
export class TypeormDatabaseModule {}
