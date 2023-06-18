import { Module } from '@nestjs/common';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';

import { MysqlConfg } from './mysql/mysql.config';
import { DatabaseConstants } from './mysql/mysql.constants';
import { ClienteEntity } from './cliente/entity/cliente.entity';
import { ClienteTypeormRepository } from './cliente/repository/cliente-typeorm.repository';
import { ProdutoEntity } from './produto/entity/produto.entity';
import { ProdutoTypeormRepository } from './produto/repository/produto-typeorm.repository';

@Module({
   imports: [
      DatabaseConstants,
      TypeOrmModule.forFeature([ClienteEntity, ProdutoEntity]),
      TypeOrmModule.forRootAsync({
         imports: [MysqlConfg],
         useFactory: async (config: TypeOrmModuleOptions) => config,
         inject: [DatabaseConstants.DATABASE_CONFIG_NAME],
      }),
   ],
   providers: [
      { provide: 'IRepository<Cliente>', useClass: ClienteTypeormRepository },
      { provide: 'IRepository<Produto>', useClass: ProdutoTypeormRepository },
   ],
   exports: [
      { provide: 'IRepository<Cliente>', useClass: ClienteTypeormRepository },
      { provide: 'IRepository<Produto>', useClass: ProdutoTypeormRepository },
   ],
})
export class TypeormDatabaseModule {}
