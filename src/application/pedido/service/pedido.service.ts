import { Inject, Injectable } from '@nestjs/common';
import { IPedidoService } from 'src/application/pedido/service/pedido.service.interface';
import { EstadoPedido } from 'src/enterprise/pedido/enums/pedido';
import { Pedido } from 'src/enterprise/pedido/model/pedido.model';
import { PedidoConstants } from 'src/shared/constants';
import { ItemPedido } from 'src/enterprise/item-pedido/model';
import {
   BuscarEstadoPedidoPorIdUseCase,
   BuscarPedidoPorIdUseCase,
   BuscarTodosPedidosPendentesUseCase,
   BuscarTodosPedidosPorEstadoUseCase,
   DeletarPedidoUseCase,
   EditarPedidoUseCase,
   SalvarPedidoUseCase,
   BuscarTodosPedidosNaoFinalizadosUseCase,
   BuscarItensPorPedidoIdUseCase,
   CheckoutPedidoUseCase,
} from 'src/application/pedido/usecase';

@Injectable()
export class PedidoService implements IPedidoService {
   constructor(
      @Inject(PedidoConstants.SALVAR_PEDIDO_USECASE) private salvarUsecase: SalvarPedidoUseCase,
      @Inject(PedidoConstants.EDITAR_PEDIDO_USECASE) private editarUsecase: EditarPedidoUseCase,
      @Inject(PedidoConstants.DELETAR_PEDIDO_USECASE) private deletarUsecase: DeletarPedidoUseCase,
      @Inject(PedidoConstants.BUSCAR_PEDIDO_POR_ID_USECASE) private buscarPorIdUsecase: BuscarPedidoPorIdUseCase,
      @Inject(PedidoConstants.BUSCAR_ESTADO_PEDIDO_POR_ID_USECASE)
      private buscarEstadoPorIdUsecase: BuscarEstadoPedidoPorIdUseCase,
      @Inject(PedidoConstants.BUSCAR_TODOS_PEDIDOS_POR_ESTADO_USECASE)
      private buscarTodosPorEstadoUsecase: BuscarTodosPedidosPorEstadoUseCase,
      @Inject(PedidoConstants.BUSCAR_TODOS_PEDIDOS_PENDENTES_USECASE)
      private buscarTodosPendentesUsecase: BuscarTodosPedidosPendentesUseCase,
      @Inject(PedidoConstants.BUSCAR_TODOS_PEDIDOS_NAO_FINALIZADOS_USECASE)
      private buscarTodosNaoFinalizadosUsecase: BuscarTodosPedidosNaoFinalizadosUseCase,
      @Inject(PedidoConstants.BUSCAR_ITENS_PEDIDO_POR_PEDIDO_ID_USECASE)
      private buscarItensPorPedidoIdUsecase: BuscarItensPorPedidoIdUseCase,
      @Inject(PedidoConstants.CHECKOUT_PEDIDO_USECASE)
      private checkoutPedidoUsecase: CheckoutPedidoUseCase,
   ) {}

   async save(pedido: Pedido): Promise<Pedido> {
      return await this.salvarUsecase.salvarPedido(pedido);
   }

   async edit(pedido: Pedido): Promise<Pedido> {
      return await this.editarUsecase.editarPedido(pedido);
   }

   async delete(pedidoId: number): Promise<boolean> {
      return await this.deletarUsecase.deletarPedido(pedidoId);
   }

   async findById(id: number): Promise<Pedido> {
      return await this.buscarPorIdUsecase.buscarPedidoPorId(id);
   }

   async findByIdEstadoDoPedido(pedidoId: number): Promise<{ estadoPedido: EstadoPedido }> {
      return await this.buscarEstadoPorIdUsecase.buscarEstadoPedidoPorId(pedidoId);
   }

   async findAllByEstadoDoPedido(estado: EstadoPedido): Promise<Pedido[]> {
      return await this.buscarTodosPorEstadoUsecase.buscarTodosPedidosPorEstado(estado);
   }

   async listarPedidosPendentes(): Promise<Pedido[]> {
      return await this.buscarTodosPendentesUsecase.buscarTodosPedidosPendentes();
   }

   async listarPedidosNaoFinalizados(): Promise<Pedido[]> {
      return await this.buscarTodosNaoFinalizadosUsecase.buscarTodosPedidos();
   }

   async checkout(pedido: Pedido): Promise<Pedido> {
      return await this.checkoutPedidoUsecase.checkout(pedido);
   }

   async buscarItensPedidoPorPedidoId(pedidoId: number): Promise<ItemPedido[]> {
      return await this.buscarItensPorPedidoIdUsecase.buscarItensPedidoPorPedidoId(pedidoId);
   }
}
