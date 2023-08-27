import { Provider } from '@nestjs/common';

import {
   CategoriaProdutoConstants,
   ClienteConstants,
   ItemPedidoConstants,
   PedidoConstants,
   ProdutoConstants,
} from 'src/shared/constants';

import { CategoriaProdutoTypeormRepository } from 'src/infrastructure/persistence/categoria/repository/categoria-produto-typeorm.repository';
import { ClienteTypeormRepository } from 'src/infrastructure/persistence/cliente/repository/cliente-typeorm.repository';
import { ItemPedidoTypeormRepository } from 'src/infrastructure/persistence/item-pedido/repository/item-pedido-typeorm.repository';
import { PedidoTypeormRepository } from 'src/infrastructure/persistence/pedido/repository/pedido-typeorm.repository';
import { ProdutoTypeormRepository } from 'src/infrastructure/persistence/produto/repository/produto-typeorm.repository';

export const PersistenceTypeOrmProviders: Provider[] = [
   { provide: ClienteConstants.IREPOSITORY, useClass: ClienteTypeormRepository },
   { provide: PedidoConstants.IREPOSITORY, useClass: PedidoTypeormRepository },
   { provide: ProdutoConstants.IREPOSITORY, useClass: ProdutoTypeormRepository },
   { provide: CategoriaProdutoConstants.IREPOSITORY, useClass: CategoriaProdutoTypeormRepository },
   { provide: ItemPedidoConstants.IREPOSITORY, useClass: ItemPedidoTypeormRepository },
];
