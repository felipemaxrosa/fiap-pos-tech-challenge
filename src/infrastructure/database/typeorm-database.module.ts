import { Module } from '@nestjs/common';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';

import { MysqlConfg } from './mysql/mysql.config';
import { DatabaseConstants } from './mysql/mysql.constants';
import { ClienteEntity } from './cliente/entity/cliente.entity';
import { ClienteTypeormRepository } from './cliente/repository/cliente-typeorm.repository';
import { PedidoEntity } from './cliente/entity/pedido.entity';
import { PedidoTypeormRepository } from './cliente/repository/pedido-typeorm.repository';
import { PedidoConstants } from 'src/shared/constants';
@Module({
   imports: [
      DatabaseConstants,
      TypeOrmModule.forFeature([ClienteEntity, PedidoEntity]),
      TypeOrmModule.forRootAsync({
         imports: [MysqlConfg],
         useFactory: async (config: TypeOrmModuleOptions) => config,
         inject: [DatabaseConstants.DATABASE_CONFIG_NAME],
      }),
   ],
   providers: [
      { provide: 'IRepository<Cliente>', useClass: ClienteTypeormRepository },
      { provide: PedidoConstants.IREPOSITORY, useClass: PedidoTypeormRepository },
   ],
   exports: [
      { provide: 'IRepository<Cliente>', useClass: ClienteTypeormRepository },
      { provide: PedidoConstants.IREPOSITORY, useClass: PedidoTypeormRepository },
   ],
})
export class TypeormDatabaseModule {}
