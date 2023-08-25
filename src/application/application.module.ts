import { Module } from '@nestjs/common';
import { CategoriaProdutoService } from 'src/application/categoria/service/categoria-produto.service';
import { ClienteService } from 'src/application/cliente/service/cliente.service';
import { ItemPedidoService } from 'src/application/item-pedido/service/item-pedido.service';
import { PedidoService } from 'src/application/pedido/service/pedido.service';
import { ProdutoService } from 'src/application/produto/service/produto.service';
import { Cliente } from 'src/enterprise/cliente/model/cliente.model';
import { BuscarClienteValidator } from 'src/application/cliente/validation/buscar-cliente.validator';
import { CpfUnicoClienteValidator } from 'src/application/cliente/validation/cpf-unico-cliente.validator';
import { CpfValidoClienteValidator } from 'src/application/cliente/validation/cpf-valido-cliente.validator';
import { EmailUnicoClienteValidator } from 'src/application/cliente/validation/email-unico-cliente.validator';
import { EmailValidoClienteValidator } from 'src/application/cliente/validation/email-valido-cliente.validator';
import { SalvarClienteValidator } from 'src/application/cliente/validation/salvar-cliente.validator';
import { ItemPedido } from 'src/enterprise/item-pedido/model';
import {
   QuantidadeMinimaItemValidator,
   ItemPedidoExistenteValidator,
   AddItemPedidoValidator,
   EditarItemPedidoValidator,
} from 'src/application/item-pedido/validation';
import { EstadoCorretoNovoPedidoValidator } from 'src/application/pedido/validation/estado-correto-novo-pedido.validator';
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
import { BuscarClientePorCpfUsecase } from 'src/application/cliente/usecase/buscar-cliente-por-cpf.usecase';
import { SalvarClienteUseCase } from 'src/application/cliente/usecase/salvar-cliente.usecase';
import { IdentificarClienteUseCase } from 'src/application/cliente/usecase/identificar-cliente-por-cpf.usecase';
import { SalvarProdutoUseCase } from 'src/application/produto/usecase/salvar-produto.usecase';
import { EditarProdutoUseCase } from 'src/application/produto/usecase/editar-produto.usecase';
import { DeletarProdutoUseCase } from 'src/application/produto/usecase/deletar-produto.usecase';
import { BuscarProdutoPorIdUseCase } from 'src/application/produto/usecase/buscar-produto-por-id.usecase';
import { BuscarProdutoPorIdCategoriaUseCase } from 'src/application/produto/usecase/buscar-produto-por-id-categoria.usecase';
import { SalvarPedidoValidator } from 'src/application/pedido/validation/salvar-pedido.validator';

@Module({
   providers: [
      // Cliente
      { provide: ClienteConstants.ISERVICE, useClass: ClienteService },
      {
         provide: ClienteConstants.BUSCAR_CLIENTE_POR_CPF_USECASE,
         inject: [ClienteConstants.IREPOSITORY, ClienteConstants.BUSCAR_CLIENTE_VALIDATOR],
         useFactory: (
            repository: IRepository<Cliente>,
            validators: BuscarClienteValidator[],
         ): BuscarClientePorCpfUsecase => new BuscarClientePorCpfUsecase(repository, validators),
      },
      {
         provide: ClienteConstants.SALVAR_CLIENTE_USECASE,
         inject: [ClienteConstants.IREPOSITORY, ClienteConstants.SALVAR_CLIENTE_VALIDATOR],
         useFactory: (repository: IRepository<Cliente>, validators: SalvarClienteValidator[]): SalvarClienteUseCase =>
            new SalvarClienteUseCase(repository, validators),
      },
      {
         provide: ClienteConstants.IDENTIFICAR_CLIENTE_POR_CPF_USECASE,
         inject: [ClienteConstants.BUSCAR_CLIENTE_POR_CPF_USECASE],
         useFactory: (usecase: BuscarClientePorCpfUsecase): IdentificarClienteUseCase =>
            new IdentificarClienteUseCase(usecase),
      },
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
         useFactory: (): SalvarPedidoValidator[] => [new EstadoCorretoNovoPedidoValidator()],
      },

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
