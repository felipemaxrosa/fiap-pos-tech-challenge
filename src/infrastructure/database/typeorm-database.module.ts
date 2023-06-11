import { Module } from '@nestjs/common';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';
import { MysqlConfg } from './mysql/mysql.config';
import { ClienteTypeormRepository } from './cliente/repository/cliente-typeorm.repository';
import { ClienteEntity } from './cliente/entity/cliente.entity';
import { DatabaseConstants } from './mysql/mysql.constants';

@Module({
    imports: [
        DatabaseConstants,
        TypeOrmModule.forFeature([ClienteEntity]),
        TypeOrmModule.forRootAsync({
            imports: [MysqlConfg],
            useFactory: async (config: TypeOrmModuleOptions) => config,
            inject: [DatabaseConstants.DATABASE_CONFIG_NAME]
          }),
    ],
    providers: [
        {provide: 'IRepository<Cliente>', useClass: ClienteTypeormRepository}
    ],
    exports: [
        {provide: 'IRepository<Cliente>', useClass: ClienteTypeormRepository},
    ]
})
export class TypeormDatabaseModule {}
