import { DynamicModule, Module } from '@nestjs/common';

import { MemoryDatabaseModule } from './memory-database.module';
import { TypeormDatabaseModule } from './typeorm-database.module';

@Module({})
export class DatabaseModule {
  static forFeature(): DynamicModule {
    if (process.env.NODE_ENV === 'local-mock-repository') {
      return {
        module: MemoryDatabaseModule,
        exports: [MemoryDatabaseModule],
      };
    } else {
      return {
        module: TypeormDatabaseModule,
        exports: [TypeormDatabaseModule],
      };
    }
  }
}
