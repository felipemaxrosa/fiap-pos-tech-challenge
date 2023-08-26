import { Module } from '@nestjs/common';
import { CategoriaProdutoService } from 'src/application/categoria/service/categoria-produto.service';
import { ClienteService } from 'src/application/cliente/service/cliente.service';
import { ItemPedidoService } from 'src/application/item-pedido/service/item-pedido.service';
import { PedidoService } from 'src/application/pedido/service/pedido.service';
import { ProdutoService } from 'src/application/produto/service/produto.service';
import { BuscarClienteValidator } from 'src/application/cliente/validation/buscar-cliente.validator';
import { CpfValidoClienteValidator } from 'src/application/cliente/validation/cpf-valido-cliente.validator';
import { ItemPedido } from 'src/enterprise/item-pedido/model';
import {
   QuantidadeMinimaItemValidator,
   ItemPedidoExistenteValidator,
   AddItemPedidoValidator,
   EditarItemPedidoValidator,
} from 'src/application/item-pedido/validation';
import { Produto } from 'src/enterprise/produto/model/produto.model';
import { CamposObrigatoriosProdutoValidator } from 'src/application/produto/validation/campos-obrigatorios-produto.validator';
import { SalvarProdutoValidator } from 'src/application/produto/validation/salvar-produto.validator';
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
import { SalvarProdutoUseCase } from 'src/application/produto/usecase/salvar-produto.usecase';
import { EditarProdutoUseCase } from 'src/application/produto/usecase/editar-produto.usecase';
import { DeletarProdutoUseCase } from 'src/application/produto/usecase/deletar-produto.usecase';
import { BuscarProdutoPorIdUseCase } from 'src/application/produto/usecase/buscar-produto-por-id.usecase';
import { BuscarProdutoPorIdCategoriaUseCase } from 'src/application/produto/usecase/buscar-produto-por-id-categoria.usecase';
import { SalvarItemPedidoUseCase } from 'src/application/item-pedido/usecase/salvar-item-pedido.usecase';
import { EditarItemPedidoUsecase } from 'src/application/item-pedido/usecase/editar-item-pedido.usecase';
import { DeletarItemPedidoUseCase } from 'src/application/item-pedido/usecase/deletar-item-pedido.usecase';

import { ClienteProviders } from 'src/application/cliente/providers/cliente.providers';
import { PedidoProviders } from 'src/application/pedido/providers/pedido.providers';

@Module({
   providers: [
      ...ClienteProviders,
      ...PedidoProviders,

      // Produto
      { provide: ProdutoConstants.ISERVICE, useClass: ProdutoService },
      {
         provide: ProdutoConstants.SALVAR_PRODUTO_USECASE,
         inject: [ProdutoConstants.IREPOSITORY, ProdutoConstants.SALVAR_PRODUTO_VALIDATOR],
         useFactory: (repository: IRepository<Produto>, validators: SalvarProdutoValidator[]): SalvarProdutoUseCase =>
            new SalvarProdutoUseCase(repository, validators),
      },
      {
         provide: ProdutoConstants.EDITAR_PRODUTO_USECASE,
         inject: [ProdutoConstants.IREPOSITORY, ProdutoConstants.SALVAR_PRODUTO_VALIDATOR],
         useFactory: (repository: IRepository<Produto>, validators: SalvarProdutoValidator[]): EditarProdutoUseCase =>
            new EditarProdutoUseCase(repository, validators),
      },
      {
         provide: ProdutoConstants.DELETAR_PRODUTO_USECASE,
         inject: [ProdutoConstants.IREPOSITORY],
         useFactory: (repository: IRepository<Produto>): DeletarProdutoUseCase => new DeletarProdutoUseCase(repository),
      },
      {
         provide: ProdutoConstants.BUSCAR_PRODUTO_POR_ID_USECASE,
         inject: [ProdutoConstants.IREPOSITORY],
         useFactory: (repository: IRepository<Produto>): BuscarProdutoPorIdUseCase =>
            new BuscarProdutoPorIdUseCase(repository),
      },
      {
         provide: ProdutoConstants.BUSCAR_PRODUTO_POR_ID_CATEGORIA_USECASE,
         inject: [ProdutoConstants.IREPOSITORY],
         useFactory: (repository: IRepository<Produto>): BuscarProdutoPorIdCategoriaUseCase =>
            new BuscarProdutoPorIdCategoriaUseCase(repository),
      },
      {
         provide: ProdutoConstants.SALVAR_PRODUTO_VALIDATOR,
         inject: [ProdutoConstants.IREPOSITORY],
         useFactory: (repository: IRepository<Produto>): SalvarProdutoValidator[] => [
            new CamposObrigatoriosProdutoValidator(repository),
         ],
      },
      {
         provide: ClienteConstants.BUSCAR_CLIENTE_VALIDATOR,
         useFactory: (): BuscarClienteValidator[] => [new CpfValidoClienteValidator()],
      },

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
