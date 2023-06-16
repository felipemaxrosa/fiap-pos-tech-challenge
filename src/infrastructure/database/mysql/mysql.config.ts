import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';

import { DatabaseConstants } from 'src/infrastructure/database/mysql/mysql.constants';

@Module({
  imports: [ConfigModule],
  providers: [
    {
      provide: DatabaseConstants.DATABASE_CONFIG_NAME,
      useFactory: (configService: ConfigService): TypeOrmModuleOptions => ({
        type: DatabaseConstants.DATABASE_TYPE,
        host: configService.get<string>('DATABASE_HOST'),
        port: configService.get<number>('DATABASE_PORT'),
        username: configService.get<string>('DATABASE_USERNAME'),
        password: configService.get<string>('DATABASE_PASSWORD'),
        database: DatabaseConstants.DATABASE_NAME,
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
export class MysqlConfg {}
