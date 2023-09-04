import { Provider } from '@nestjs/common';
import { SolicitaPagamentoPedidoUseCase } from 'src/application/pagamento/usecase';

import { PedidoService } from 'src/application/pedido/service/pedido.service';
import { BuscarEstadoPedidoPorIdUseCase } from 'src/application/pedido/usecase/buscar-estado-pedido-por-id.usecase';
import { BuscarItensPorPedidoIdUseCase } from 'src/application/pedido/usecase/buscar-itens-por-pedido-id.usecase';
import { BuscarPedidoPorIdUseCase } from 'src/application/pedido/usecase/buscar-pedido-por-id.usecase';
import { BuscarTodosPedidosNaoFinalizadosUseCase } from 'src/application/pedido/usecase/buscar-todos-pedidos-nao-finalizados.usecase';
import { BuscarTodosPedidosPendentesUseCase } from 'src/application/pedido/usecase/buscar-todos-pedidos-pendentes.usecase';
import { BuscarTodosPedidosPorEstadoUseCase } from 'src/application/pedido/usecase/buscar-todos-pedidos-por-estado.usecase';
import { CheckoutPedidoUseCase } from 'src/application/pedido/usecase/checkout-pedido.usecase';
import { DeletarPedidoUseCase } from 'src/application/pedido/usecase/deletar-pedido.usecase';
import { EditarPedidoUseCase } from 'src/application/pedido/usecase/editar-pedido.usecase';
import { SalvarPedidoUseCase } from 'src/application/pedido/usecase/salvar-pedido.usecase';
import { CheckoutPedidoRealizadoValidator } from 'src/application/pedido/validation/checkout-pedido-realizado-validator';
import { CheckoutPedidoValidator } from 'src/application/pedido/validation/checkout-pedido.validator';
import { ClienteExistentePedidoValidator } from 'src/application/pedido/validation/cliente-existente-pedido.validator';
import { DataInicioNovoPedidoValidator } from 'src/application/pedido/validation/data-inicio-novo-pedido.validator';
import { EditarPedidoValidator } from 'src/application/pedido/validation/editar-pedido.validator';
import { EstadoCorretoNovoPedidoValidator } from 'src/application/pedido/validation/estado-correto-novo-pedido.validator';
import { PedidoExistenteValidator } from 'src/application/pedido/validation/pedido-existente.validator';
import { SalvarPedidoValidator } from 'src/application/pedido/validation/salvar-pedido.validator';
import { BuscarProdutoPorIdUseCase } from 'src/application/produto/usecase/buscar-produto-por-id.usecase';
import { Cliente } from 'src/enterprise/cliente/model/cliente.model';
import { ItemPedido } from 'src/enterprise/item-pedido/model';
import { Pagamento } from 'src/enterprise/pagamento/model/pagamento.model';
import { Pedido } from 'src/enterprise/pedido/model/pedido.model';
import { IPedidoRepository } from 'src/enterprise/pedido/repository/pedido.repository.interface';
import { Produto } from 'src/enterprise/produto/model/produto.model';
import { IRepository } from 'src/enterprise/repository/repository';
import {
   ClienteConstants,
   ItemPedidoConstants,
   PagamentoConstants,
   PedidoConstants,
   ProdutoConstants,
} from 'src/shared/constants';

export const PedidoProviders: Provider[] = [
   { provide: PedidoConstants.ISERVICE, useClass: PedidoService },
   {
      provide: PedidoConstants.SALVAR_PEDIDO_VALIDATOR,
      inject: [PedidoConstants.IREPOSITORY, ClienteConstants.IREPOSITORY],
      useFactory: (clienteRepository: IRepository<Cliente>): SalvarPedidoValidator[] => [
         new DataInicioNovoPedidoValidator(),
         new EstadoCorretoNovoPedidoValidator(),
         new ClienteExistentePedidoValidator(clienteRepository),
      ],
   },

   {
      provide: PedidoConstants.CHECKOUT_PEDIDO_VALIDATOR,
      inject: [ClienteConstants.IREPOSITORY, PagamentoConstants.IREPOSITORY],
      useFactory: (
         clienteRepository: IRepository<Cliente>,
         pagamentoRepository: IRepository<Pagamento>,
      ): CheckoutPedidoValidator[] => [
         new ClienteExistentePedidoValidator(clienteRepository),
         new CheckoutPedidoRealizadoValidator(pagamentoRepository),
      ],
   },
   {
      provide: PedidoConstants.EDITAR_PEDIDO_VALIDATOR,
      inject: [ClienteConstants.IREPOSITORY, PedidoConstants.IREPOSITORY],
      useFactory: (
         clienteRepository: IRepository<Cliente>,
         pedidoRepository: IRepository<Pedido>,
      ): EditarPedidoValidator[] => [
         new DataInicioNovoPedidoValidator(),
         new ClienteExistentePedidoValidator(clienteRepository),
         new PedidoExistenteValidator(pedidoRepository),
      ],
   },
   {
      provide: PedidoConstants.SALVAR_PEDIDO_USECASE,
      inject: [PedidoConstants.IREPOSITORY, PedidoConstants.SALVAR_PEDIDO_VALIDATOR],
      useFactory: (repository: IPedidoRepository, validators: SalvarPedidoValidator[]): SalvarPedidoUseCase =>
         new SalvarPedidoUseCase(repository, validators),
   },
   {
      provide: PedidoConstants.EDITAR_PEDIDO_USECASE,
      inject: [PedidoConstants.IREPOSITORY, PedidoConstants.EDITAR_PEDIDO_VALIDATOR],
      useFactory: (repository: IPedidoRepository, validators: EditarPedidoValidator[]): EditarPedidoUseCase =>
         new EditarPedidoUseCase(repository, validators),
   },
   {
      provide: PedidoConstants.DELETAR_PEDIDO_USECASE,
      inject: [PedidoConstants.IREPOSITORY],
      useFactory: (repository: IPedidoRepository): DeletarPedidoUseCase => new DeletarPedidoUseCase(repository),
   },
   {
      provide: PedidoConstants.BUSCAR_PEDIDO_POR_ID_USECASE,
      inject: [PedidoConstants.IREPOSITORY],
      useFactory: (repository: IPedidoRepository): BuscarPedidoPorIdUseCase => new BuscarPedidoPorIdUseCase(repository),
   },
   {
      provide: PedidoConstants.BUSCAR_ESTADO_PEDIDO_POR_ID_USECASE,
      inject: [PedidoConstants.IREPOSITORY],
      useFactory: (repository: IPedidoRepository): BuscarEstadoPedidoPorIdUseCase =>
         new BuscarEstadoPedidoPorIdUseCase(repository),
   },
   {
      provide: PedidoConstants.BUSCAR_TODOS_PEDIDOS_POR_ESTADO_USECASE,
      inject: [PedidoConstants.IREPOSITORY],
      useFactory: (repository: IPedidoRepository): BuscarTodosPedidosPorEstadoUseCase =>
         new BuscarTodosPedidosPorEstadoUseCase(repository),
   },
   {
      provide: PedidoConstants.BUSCAR_TODOS_PEDIDOS_PENDENTES_USECASE,
      inject: [PedidoConstants.IREPOSITORY],
      useFactory: (repository: IPedidoRepository): BuscarTodosPedidosPendentesUseCase =>
         new BuscarTodosPedidosPendentesUseCase(repository),
   },
   {
      provide: PedidoConstants.BUSCAR_TODOS_PEDIDOS_NAO_FINALIZADOS_USECASE,
      inject: [PedidoConstants.IREPOSITORY],
      useFactory: (repository: IPedidoRepository): BuscarTodosPedidosNaoFinalizadosUseCase =>
         new BuscarTodosPedidosNaoFinalizadosUseCase(repository),
   },
   {
      provide: PedidoConstants.BUSCAR_ITENS_PEDIDO_POR_PEDIDO_ID_USECASE,
      inject: [ItemPedidoConstants.IREPOSITORY],
      useFactory: (repository: IRepository<ItemPedido>): BuscarItensPorPedidoIdUseCase =>
         new BuscarItensPorPedidoIdUseCase(repository),
   },

   {
      provide: PedidoConstants.CHECKOUT_PEDIDO_USECASE,
      inject: [
         ProdutoConstants.IREPOSITORY,
         PedidoConstants.BUSCAR_ITENS_PEDIDO_POR_PEDIDO_ID_USECASE,
         PedidoConstants.EDITAR_PEDIDO_USECASE,
         PagamentoConstants.SOLICITA_PAGAMENTO_PEDIDO_USECASE,
         PedidoConstants.CHECKOUT_PEDIDO_VALIDATOR,
      ],
      useFactory: (
         repository: IRepository<Produto>,
         buscarItensPorPedidoIdUsecase: BuscarItensPorPedidoIdUseCase,
         editarPedidoUsecase: EditarPedidoUseCase,
         solicitaPagamentoPedidoUseCase: SolicitaPagamentoPedidoUseCase,
         validators: CheckoutPedidoValidator[],
      ): CheckoutPedidoUseCase =>
         new CheckoutPedidoUseCase(
            new BuscarProdutoPorIdUseCase(repository),
            buscarItensPorPedidoIdUsecase,
            editarPedidoUsecase,
            solicitaPagamentoPedidoUseCase,
            validators,
         ),
   },
];
