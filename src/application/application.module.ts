import { Module } from '@nestjs/common';

import { CategoriaProdutoService } from 'src/application/categoria/service/categoria-produto.service';
import { ClienteService } from 'src/application/cliente/service/cliente.service';
import { ItemPedidoService } from 'src/application/item-pedido/service/item-pedido.service';
import { PedidoService } from 'src/application/pedido/service/pedido.service';
import { ProdutoService } from 'src/application/produto/service/produto.service';
import { IRepository } from 'src/enterprise/repository/repository';
import {
   ClienteConstants,
   PedidoConstants,
   ProdutoConstants,
   ItemPedidoConstants,
   CategoriaProdutoConstants,
} from 'src/shared/constants';
import { BuscarTodasCategoriasUseCase } from 'src/application/categoria/usecase/buscar-todas-categorias.usecase';
import { CategoriaProduto } from 'src/enterprise/categoria/model/categoria-produto.model';
import { ClienteProviders } from 'src/application/cliente/providers/cliente.providers';
import { PedidoProviders } from 'src/application/pedido/providers/pedido.providers';
import { ProdutoProviders } from 'src/application/produto/providers/produto.providers';
import { ItemPedidoProviders } from 'src/application/item-pedido/providers/item-pedido.providers';

@Module({
   providers: [
      ...ClienteProviders,
      ...PedidoProviders,
      ...ProdutoProviders,
      ...ItemPedidoProviders,

      // Categoria de Produto
      { provide: CategoriaProdutoConstants.ISERVICE, useClass: CategoriaProdutoService },
      {
         provide: CategoriaProdutoConstants.BUSCAR_TODAS_CATEGORIAS_USECASE,
         inject: [CategoriaProdutoConstants.IREPOSITORY],
         useFactory: (repository: IRepository<CategoriaProduto>): BuscarTodasCategoriasUseCase =>
            new BuscarTodasCategoriasUseCase(repository),
      },
   ],
   exports: [
      { provide: ClienteConstants.ISERVICE, useClass: ClienteService },
      { provide: PedidoConstants.ISERVICE, useClass: PedidoService },
      { provide: ItemPedidoConstants.ISERVICE, useClass: ItemPedidoService },
      { provide: ProdutoConstants.ISERVICE, useClass: ProdutoService },
      { provide: CategoriaProdutoConstants.ISERVICE, useClass: CategoriaProdutoService },
   ],
})
export class ApplicationModule {}
