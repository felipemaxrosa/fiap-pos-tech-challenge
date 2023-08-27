import { Provider } from '@nestjs/common';

import {
   CategoriaProdutoConstants,
   ClienteConstants,
   ItemPedidoConstants,
   PedidoConstants,
   ProdutoConstants,
} from 'src/shared/constants';
import { CategoriaProdutoMemoryRepository } from 'src/infrastructure/persistence/categoria/repository/categoria-produto-memory.repository';
import { ClienteMemoryRepository } from 'src/infrastructure/persistence/cliente/repository/cliente-memory.repository';
import { ItemPedidoMemoryRepository } from 'src/infrastructure/persistence/item-pedido/repository/item-pedido-memory.repository';
import { PedidoMemoryRepository } from 'src/infrastructure/persistence/pedido/repository/pedido-memory.repository';
import { ProdutoMemoryRepository } from 'src/infrastructure/persistence/produto/repository/produto-memory.repository';

export const PersistenceInMemoryProviders: Provider[] = [
   { provide: ClienteConstants.IREPOSITORY, useClass: ClienteMemoryRepository },
   { provide: PedidoConstants.IREPOSITORY, useClass: PedidoMemoryRepository },
   { provide: ProdutoConstants.IREPOSITORY, useClass: ProdutoMemoryRepository },
   { provide: CategoriaProdutoConstants.IREPOSITORY, useClass: CategoriaProdutoMemoryRepository },
   { provide: ItemPedidoConstants.IREPOSITORY, useClass: ItemPedidoMemoryRepository },
];
