import { Module } from '@nestjs/common';

import { CategoriaProdutoService } from 'src/application/categoria/service/categoria-produto.service';
import { ClienteService } from 'src/application/cliente/service/cliente.service';
import { ItemPedidoService } from 'src/application/item-pedido/service/item-pedido.service';
import { PedidoService } from 'src/application/pedido/service/pedido.service';
import { ProdutoService } from 'src/application/produto/service/produto.service';
import { ItemPedido } from 'src/enterprise/item-pedido/model';
import {
   QuantidadeMinimaItemValidator,
   ItemPedidoExistenteValidator,
   AddItemPedidoValidator,
   EditarItemPedidoValidator,
} from 'src/application/item-pedido/validation';
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
import { SalvarItemPedidoUseCase } from 'src/application/item-pedido/usecase/salvar-item-pedido.usecase';
import { EditarItemPedidoUsecase } from 'src/application/item-pedido/usecase/editar-item-pedido.usecase';
import { DeletarItemPedidoUseCase } from 'src/application/item-pedido/usecase/deletar-item-pedido.usecase';

import { ClienteProviders } from 'src/application/cliente/providers/cliente.providers';
import { PedidoProviders } from 'src/application/pedido/providers/pedido.providers';
import { ProdutoProviders } from 'src/application/produto/providers/produto.providers';

@Module({
   providers: [
      ...ClienteProviders,
      ...PedidoProviders,
      ...ProdutoProviders,

      // Item do Pedido
      { provide: ItemPedidoConstants.ISERVICE, useClass: ItemPedidoService },
      {
         provide: ItemPedidoConstants.ADD_ITEM_PEDIDO_VALIDATOR,
         useFactory: (): AddItemPedidoValidator[] => [new QuantidadeMinimaItemValidator()],
      },
      {
         provide: ItemPedidoConstants.EDITAR_ITEM_PEDIDO_VALIDATOR,
         inject: [ItemPedidoConstants.IREPOSITORY],
         useFactory: (repository: IRepository<ItemPedido>): EditarItemPedidoValidator[] => [
            new ItemPedidoExistenteValidator(repository),
         ],
      },
      {
         provide: ItemPedidoConstants.SALVAR_ITEM_PEDIDO_USECASE,
         inject: [ItemPedidoConstants.IREPOSITORY, ItemPedidoConstants.ADD_ITEM_PEDIDO_VALIDATOR],
         useFactory: (
            repository: IRepository<ItemPedido>,
            validators: AddItemPedidoValidator[],
         ): SalvarItemPedidoUseCase => new SalvarItemPedidoUseCase(repository, validators),
      },
      {
         provide: ItemPedidoConstants.EDITAR_ITEM_PEDIDO_USECASE,
         inject: [
            ItemPedidoConstants.IREPOSITORY,
            ItemPedidoConstants.ADD_ITEM_PEDIDO_VALIDATOR,
            ItemPedidoConstants.EDITAR_ITEM_PEDIDO_VALIDATOR,
         ],
         useFactory: (
            repository: IRepository<ItemPedido>,
            adicionarValidators: AddItemPedidoValidator[],
            editarValidators: EditarItemPedidoValidator[],
         ): EditarItemPedidoUsecase => new EditarItemPedidoUsecase(repository, adicionarValidators, editarValidators),
      },
      {
         provide: ItemPedidoConstants.DELETAR_ITEM_PEDIDO_USECASE,
         inject: [ItemPedidoConstants.IREPOSITORY],
         useFactory: (repository: IRepository<ItemPedido>): DeletarItemPedidoUseCase =>
            new DeletarItemPedidoUseCase(repository),
      },

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
