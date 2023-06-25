import { Module } from '@nestjs/common';

import { ClienteMemoryRepository } from './cliente/repository/cliente-memory.repository';
import { PedidoMemoryRepository } from './pedido/repository/pedido-memory.repository';
import { PedidoConstants } from 'src/shared/constants';
import { ProdutoMemoryRepository } from './produto/repository/produto-memory.repository';
import { CategoriaProdutoMemoryRepository } from './categoria/repository/categoria-produto-memory.repository';

@Module({
   providers: [
      { provide: 'IRepository<Cliente>', useClass: ClienteMemoryRepository },
      { provide: PedidoConstants.IREPOSITORY, useClass: PedidoMemoryRepository },
      { provide: 'IRepository<Produto>', useClass: ProdutoMemoryRepository },
      { provide: 'IRepository<CategoriaProduto>', useClass: CategoriaProdutoMemoryRepository },
   ],
   exports: [
      { provide: 'IRepository<Cliente>', useClass: ClienteMemoryRepository },
      { provide: PedidoConstants.IREPOSITORY, useClass: PedidoMemoryRepository },
      { provide: 'IRepository<Produto>', useClass: ProdutoMemoryRepository },
      { provide: 'IRepository<CategoriaProduto>', useClass: CategoriaProdutoMemoryRepository },
   ],
})
export class MemoryDatabaseModule {}
