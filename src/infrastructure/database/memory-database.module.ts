import { Module } from '@nestjs/common';
import { ClienteMemoryRepository } from './cliente/repository/cliente-memory.repository';

@Module({
  providers: [
    { provide: 'IRepository<Cliente>', useClass: ClienteMemoryRepository },
  ],
  exports: [
    { provide: 'IRepository<Cliente>', useClass: ClienteMemoryRepository },
  ],
})
export class MemoryDatabaseModule {}
