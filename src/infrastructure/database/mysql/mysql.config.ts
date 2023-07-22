import { Module } from '@nestjs/common';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';

import { DatabaseConstants } from '../../../infrastructure/database/mysql/mysql.constants';

@Module({
   imports: [ConfigModule],
   providers: [
      {
         provide: DatabaseConstants.DATABASE_CONFIG_NAME,
         useFactory: (configService: ConfigService): TypeOrmModuleOptions => ({
            type: DatabaseConstants.DATABASE_TYPE,
            host: configService.get<string>('MYSQL_HOST'),
            port: configService.get<number>('MYSQL_PORT'),
            username: configService.get<string>('MYSQL_USER'),
            password: configService.get<string>('MYSQL_PASSWORD'),
            database: configService.get<string>('MYSQL_DATABASE'),
            entities: DatabaseConstants.DATABASE_ENTITIES,
            synchronize: DatabaseConstants.DATABASE_SYNCHRONIZE,
            logging: DatabaseConstants.DATABASE_LOGGING,
            autoLoadEntities: DatabaseConstants.DATABASE_AUTO_LOAD_ENTITIES,
         }),
         inject: [ConfigService],
      },
   ],
   exports: [DatabaseConstants.DATABASE_CONFIG_NAME],
})
export class MysqlConfig {}
