import { Module } from '@nestjs/common';
import { CategoriaProdutoMemoryRepository } from 'src/infrastructure/persistence/categoria/repository/categoria-produto-memory.repository';
import { ClienteMemoryRepository } from 'src/infrastructure/persistence/cliente/repository/cliente-memory.repository';
import { ItemPedidoMemoryRepository } from 'src/infrastructure/persistence/item-pedido/repository/item-pedido-memory.repository';
import { PedidoMemoryRepository } from 'src/infrastructure/persistence/pedido/repository/pedido-memory.repository';
import { ProdutoMemoryRepository } from 'src/infrastructure/persistence/produto/repository/produto-memory.repository';
import {
   ClienteConstants,
   PedidoConstants,
   ProdutoConstants,
   CategoriaProdutoConstants,
   ItemPedidoConstants,
} from 'src/shared/constants';

@Module({
   providers: [
      { provide: ClienteConstants.IREPOSITORY, useClass: ClienteMemoryRepository },
      { provide: PedidoConstants.IREPOSITORY, useClass: PedidoMemoryRepository },
      { provide: ProdutoConstants.IREPOSITORY, useClass: ProdutoMemoryRepository },
      { provide: CategoriaProdutoConstants.IREPOSITORY, useClass: CategoriaProdutoMemoryRepository },
      { provide: ItemPedidoConstants.IREPOSITORY, useClass: ItemPedidoMemoryRepository },
   ],
   exports: [
      { provide: ClienteConstants.IREPOSITORY, useClass: ClienteMemoryRepository },
      { provide: PedidoConstants.IREPOSITORY, useClass: PedidoMemoryRepository },
      { provide: ProdutoConstants.IREPOSITORY, useClass: ProdutoMemoryRepository },
      { provide: CategoriaProdutoConstants.IREPOSITORY, useClass: CategoriaProdutoMemoryRepository },
      { provide: ItemPedidoConstants.IREPOSITORY, useClass: ItemPedidoMemoryRepository },
   ],
})
export class MemoryDatabaseModule {}
