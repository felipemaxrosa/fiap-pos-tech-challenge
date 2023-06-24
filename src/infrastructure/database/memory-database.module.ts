import { Module } from '@nestjs/common';

import { ClienteMemoryRepository } from './cliente/repository/cliente-memory.repository';
import { PedidoMemoryRepository } from './pedido/repository/pedido-memory.repository';
import { PedidoConstants } from 'src/shared/constants';
import { ProdutoMemoryRepository } from './produto/repository/produto-memory.repository';

@Module({
   providers: [
      { provide: 'IRepository<Cliente>', useClass: ClienteMemoryRepository },
      { provide: PedidoConstants.IREPOSITORY, useClass: PedidoMemoryRepository },
   ],
   exports: [
      { provide: 'IRepository<Cliente>', useClass: ClienteMemoryRepository },
      { provide: PedidoConstants.IREPOSITORY, useClass: PedidoMemoryRepository },
      { provide: 'IRepository<Produto>', useClass: ProdutoMemoryRepository },
   ],
})
export class MemoryDatabaseModule {}
