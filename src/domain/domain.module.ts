import { Module } from '@nestjs/common';
import { Cliente } from './cliente/model/cliente.model';
import { ClienteService } from './cliente/service/cliente.service';
import { IRepository } from './repository/repository';
import { CpfUnicoClienteValidator } from './cliente/validation/cpf-unico-cliente.validator';
import { EmailUnicoClienteValidator } from './cliente/validation/email-unico-cliente.validator';
import { SalvarClienteValidator } from './cliente/validation/salvar-cliente.validator';
import { PedidoService } from './pedido/service/pedido.service';
import { SalvarPedidoValidator } from './pedido/validation/salvar-pedido.validator';
import { EstadoCorretoNovoPedidoValidator } from './pedido/validation/estado-correto-novo-pedido.validator';
import { ItemPedidoConstants, PedidoConstants } from 'src/shared/constants';
import { ProdutoService } from './produto/service/produto.service';
import { Produto } from './produto/model/produto.model';
import { SalvarProdutoValidator } from './produto/validation/salvar-produto.validator';
import { CamposObrigatoriosProdutoValidator } from './produto/validation/campos-obrigatorios-produto.validator';
import { BuscarClienteValidator } from './cliente/validation/buscar-cliente.validator';
import { CpfValidoClienteValidator } from './cliente/validation/cpf-valido-cliente.validator';
import { EmailValidoClienteValidator } from './cliente/validation/email-valido-cliente.validator.';
import { CategoriaProdutoService } from './categoria/service/categoria-produto.service';
import { ItemPedidoService } from './item-pedido/service/item-pedido.service';
import {
   AddItemPedidoValidator,
   EditarItemPedidoValidator,
   QuantidadeMinimaItemValidator,
   ItemPedidoExistenteValidator,
} from './item-pedido/validation';
import { ItemPedido } from './item-pedido/model';

@Module({
   providers: [
      // Cliente
      { provide: 'IService<Cliente>', useClass: ClienteService },
      {
         provide: 'SalvarClienteValidator',
         inject: ['IRepository<Cliente>'],
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
         provide: 'SalvarPedidoValidator',
         inject: ['IRepository<Cliente>'],
         useFactory: (): SalvarPedidoValidator[] => [new EstadoCorretoNovoPedidoValidator()],
      },

      // Produto
      { provide: 'IService<Produto>', useClass: ProdutoService },
      {
         provide: 'SalvarProdutoValidator',
         inject: ['IRepository<Produto>'],
         useFactory: (repository: IRepository<Produto>): SalvarProdutoValidator[] => [
            new CamposObrigatoriosProdutoValidator(repository),
         ],
      },
      {
         provide: 'BuscarClienteValidator',
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
      { provide: 'IService<CategoriaProduto>', useClass: CategoriaProdutoService },
   ],
   exports: [
      { provide: 'IService<Cliente>', useClass: ClienteService },
      { provide: PedidoConstants.ISERVICE, useClass: PedidoService },
      { provide: ItemPedidoConstants.ISERVICE, useClass: ItemPedidoService },
      { provide: 'IService<Produto>', useClass: ProdutoService },
      { provide: 'IService<CategoriaProduto>', useClass: CategoriaProdutoService },
   ],
})
export class DomainModule {}
