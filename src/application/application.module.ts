import { Module } from '@nestjs/common';

import { CategoriaProdutoService } from 'src/application/categoria/service/categoria-produto.service';
import { ClienteService } from 'src/application/cliente/service/cliente.service';
import { ItemPedidoService } from 'src/application/item-pedido/service/item-pedido.service';
import { PedidoService } from 'src/application/pedido/service/pedido.service';
import { ProdutoService } from 'src/application/produto/service/produto.service';
import { PagamentoService } from './pagamento/service/pagamento.service';
import { ClienteProviders } from 'src/application/cliente/providers/cliente.providers';
import { PedidoProviders } from 'src/application/pedido/providers/pedido.providers';
import { ProdutoProviders } from 'src/application/produto/providers/produto.providers';
import { ItemPedidoProviders } from 'src/application/item-pedido/providers/item-pedido.providers';
import { CategoriaProdutosProviders } from 'src/application/categoria/providers/categoria.providers';
import { PagamentoProviders } from 'src/application/pagamento/providers/pagamento.providers';
import {
   ClienteConstants,
   PedidoConstants,
   ProdutoConstants,
   ItemPedidoConstants,
   CategoriaProdutoConstants,
   PagamentoConstants,
} from 'src/shared/constants';

@Module({
   providers: [
      ...ClienteProviders,
      ...PedidoProviders,
      ...ProdutoProviders,
      ...ItemPedidoProviders,
      ...CategoriaProdutosProviders,
      ...PagamentoProviders,
   ],
   exports: [
      { provide: ClienteConstants.ISERVICE, useClass: ClienteService },
      { provide: PedidoConstants.ISERVICE, useClass: PedidoService },
      { provide: ItemPedidoConstants.ISERVICE, useClass: ItemPedidoService },
      { provide: ProdutoConstants.ISERVICE, useClass: ProdutoService },
      { provide: CategoriaProdutoConstants.ISERVICE, useClass: CategoriaProdutoService },
      { provide: PagamentoConstants.ISERVICE, useClass: PagamentoService },
   ],
})
export class ApplicationModule {}
