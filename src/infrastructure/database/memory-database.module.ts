import { Module } from '@nestjs/common';

import { ClienteMemoryRepository } from './cliente/repository/cliente-memory.repository';
import { PedidoMemoryRepository } from './pedido/repository/pedido-memory.repository';
import { ItemPedidoConstants, PedidoConstants } from 'src/shared/constants';
import { ProdutoMemoryRepository } from './produto/repository/produto-memory.repository';
import { CategoriaProdutoMemoryRepository } from './categoria/repository/categoria-produto-memory.repository';
import { ItemPedidoMemoryRepository } from './item-pedido/repository/item-pedido-memory.repository';

@Module({
   providers: [
      { provide: 'IRepository<Cliente>', useClass: ClienteMemoryRepository },
      { provide: PedidoConstants.IREPOSITORY, useClass: PedidoMemoryRepository },
      { provide: 'IRepository<Produto>', useClass: ProdutoMemoryRepository },
      { provide: 'IRepository<CategoriaProduto>', useClass: CategoriaProdutoMemoryRepository },
      { provide: ItemPedidoConstants.IREPOSITORY, useClass: ItemPedidoMemoryRepository },
   ],
   exports: [
      { provide: 'IRepository<Cliente>', useClass: ClienteMemoryRepository },
      { provide: PedidoConstants.IREPOSITORY, useClass: PedidoMemoryRepository },
      { provide: 'IRepository<Produto>', useClass: ProdutoMemoryRepository },
      { provide: 'IRepository<CategoriaProduto>', useClass: CategoriaProdutoMemoryRepository },
      { provide: ItemPedidoConstants.IREPOSITORY, useClass: ItemPedidoMemoryRepository },
   ],
})
export class MemoryDatabaseModule {}
