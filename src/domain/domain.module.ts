import { Module } from '@nestjs/common';

import {
   CategoriaProdutoConstants,
   ClienteConstants,
   ItemPedidoConstants,
   PedidoConstants,
   ProdutoConstants,
} from '../shared/constants';

import {
   AddItemPedidoValidator,
   EditarItemPedidoValidator,
   QuantidadeMinimaItemValidator,
   ItemPedidoExistenteValidator,
} from './item-pedido/validation';
import { ItemPedido } from './item-pedido/model';
import { IRepository } from './repository/repository';
import { Cliente } from './cliente/model/cliente.model';
import { Produto } from './produto/model/produto.model';
import { PedidoService } from './pedido/service/pedido.service';
import { ClienteService } from './cliente/service/cliente.service';
import { ProdutoService } from './produto/service/produto.service';
import { ItemPedidoService } from './item-pedido/service/item-pedido.service';
import { SalvarPedidoValidator } from './pedido/validation/salvar-pedido.validator';
import { SalvarProdutoValidator } from './produto/validation/salvar-produto.validator';
import { SalvarClienteValidator } from './cliente/validation/salvar-cliente.validator';
import { BuscarClienteValidator } from './cliente/validation/buscar-cliente.validator';
import { CategoriaProdutoService } from './categoria/service/categoria-produto.service';
import { CpfUnicoClienteValidator } from './cliente/validation/cpf-unico-cliente.validator';
import { CpfValidoClienteValidator } from './cliente/validation/cpf-valido-cliente.validator';
import { EmailUnicoClienteValidator } from './cliente/validation/email-unico-cliente.validator';
import { EmailValidoClienteValidator } from './cliente/validation/email-valido-cliente.validator';
import { EstadoCorretoNovoPedidoValidator } from './pedido/validation/estado-correto-novo-pedido.validator';
import { CamposObrigatoriosProdutoValidator } from './produto/validation/campos-obrigatorios-produto.validator';

@Module({
   providers: [
      // Cliente
      { provide: ClienteConstants.ISERVICE, useClass: ClienteService },
      {
         provide: ClienteConstants.SALVAR_CLIENTE_VALIDATOR,
         inject: [ClienteConstants.IREPOSITORY],
         useFactory: (repository: IRepository<Cliente>): SalvarClienteValidator[] => [
            new CpfValidoClienteValidator(),
            new EmailValidoClienteValidator(),
            new EmailUnicoClienteValidator(repository),
            new CpfUnicoClienteValidator(repository),
         ],
      },

      // Pedido
      { provide: PedidoConstants.ISERVICE, useClass: PedidoService },
      {
         provide: PedidoConstants.SALVAR_PEDIDO_VALIDATOR,
         inject: [ClienteConstants.IREPOSITORY],
         useFactory: (): SalvarPedidoValidator[] => [new EstadoCorretoNovoPedidoValidator()],
      },

      // Produto
      { provide: ProdutoConstants.ISERVICE, useClass: ProdutoService },
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
         inject: [ItemPedidoConstants.IREPOSITORY],
         useFactory: (): AddItemPedidoValidator[] => [new QuantidadeMinimaItemValidator()],
      },
      {
         provide: ItemPedidoConstants.EDITAR_ITEM_PEDIDO_VALIDATOR,
         inject: [ItemPedidoConstants.IREPOSITORY],
         useFactory: (repository: IRepository<ItemPedido>): EditarItemPedidoValidator[] => [
            new ItemPedidoExistenteValidator(repository),
         ],
      },
      // Categoria de Produto
      { provide: CategoriaProdutoConstants.ISERVICE, useClass: CategoriaProdutoService },
   ],
   exports: [
      { provide: ClienteConstants.ISERVICE, useClass: ClienteService },
      { provide: PedidoConstants.ISERVICE, useClass: PedidoService },
      { provide: ItemPedidoConstants.ISERVICE, useClass: ItemPedidoService },
      { provide: ProdutoConstants.ISERVICE, useClass: ProdutoService },
      { provide: CategoriaProdutoConstants.ISERVICE, useClass: CategoriaProdutoService },
   ],
})
export class DomainModule {}
