import { Module } from '@nestjs/common';

import { ClienteMemoryRepository } from './cliente/repository/cliente-memory.repository';
import { ProdutoMemoryRepository } from './produto/repository/produto-memory.repository';

@Module({
   providers: [
      { provide: 'IRepository<Cliente>', useClass: ClienteMemoryRepository },
      { provide: 'IRepository<Produto>', useClass: ProdutoMemoryRepository },
   ],
   exports: [
      { provide: 'IRepository<Cliente>', useClass: ClienteMemoryRepository },
      { provide: 'IRepository<Produto>', useClass: ProdutoMemoryRepository },
   ],
})
export class MemoryDatabaseModule {}
