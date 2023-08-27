import { Module } from '@nestjs/common';
import { PersistenceInMemoryProviders } from 'src/infrastructure/persistence/providers/persistence-in-memory.providers';

@Module({
   providers: [...PersistenceInMemoryProviders],
   exports: [...PersistenceInMemoryProviders],
})
export class MemoryDatabaseModule {}
