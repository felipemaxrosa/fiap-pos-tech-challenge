import { Inject, Injectable } from '@nestjs/common';
import { IPedidoService } from 'src/application/pedido/service/pedido.service.interface';
import { EstadoPedido } from 'src/enterprise/pedido/enums/pedido';
import { Pedido } from 'src/enterprise/pedido/model/pedido.model';
import { PedidoConstants } from 'src/shared/constants';
import { BuscarEstadoPedidoPorIdUseCase } from 'src/application/pedido/usecase/buscar-estado-pedido-por-id.usecase';
import { BuscarPedidoPorIdUseCase } from 'src/application/pedido/usecase/buscar-pedido-por-id.usecase';
import { BuscarTodosPedidosPendentesUseCase } from 'src/application/pedido/usecase/buscar-todos-pedidos-pendentes.usecase';
import { BuscarTodosPedidosPorEstadoUseCase } from 'src/application/pedido/usecase/buscar-todos-pedidos-por-estado.usecase';
import { DeletarPedidoUseCase } from 'src/application/pedido/usecase/deletar-pedido.usecase';
import { EditarPedidoUseCase } from 'src/application/pedido/usecase/editar-pedido.usecase';
import { SalvarPedidoUseCase } from 'src/application/pedido/usecase/salvar-pedido.usecase';

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
}
