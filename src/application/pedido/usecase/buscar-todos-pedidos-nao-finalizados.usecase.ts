import { Inject, Injectable, Logger } from '@nestjs/common';
import { ServiceException } from 'src/enterprise/exception/service.exception';
import { EstadoPedido } from 'src/enterprise/pedido/enums/pedido';
import { Pedido } from 'src/enterprise/pedido/model/pedido.model';
import { IPedidoRepository } from 'src/enterprise/pedido/repository/pedido.repository.interface';
import { PedidoConstants } from 'src/shared/constants';

const estadosDePedidoParaListagem = [EstadoPedido.RECEBIDO, EstadoPedido.EM_PREPARACAO, EstadoPedido.PRONTO];

@Injectable()
export class BuscarTodosPedidosNaoFinalizadosUseCase {
   private logger = new Logger(BuscarTodosPedidosNaoFinalizadosUseCase.name);

   constructor(@Inject(PedidoConstants.IREPOSITORY) private repository: IPedidoRepository) {}

   private ordenarPorEstadoDoPedido(pedidoA: Pedido, pedidoB: Pedido): number {
      if (pedidoA.estadoPedido > pedidoB.estadoPedido) {
         return -1;
      }

      if (pedidoA.estadoPedido < pedidoB.estadoPedido) {
         return 1;
      }

      return 0;
   }

   private ordenarPorIdDoPedido(pedidoA: Pedido, pedidoB: Pedido): number {
      if (pedidoA.id > pedidoB.id) {
         return 1;
      }

      if (pedidoA.id < pedidoB.id) {
         return -1;
      }

      return 0;
   }

   async buscarTodosPedidos(): Promise<Pedido[]> {
      const pedidos = await this.repository.findAll().catch((error) => {
         this.logger.error(`Erro ao buscar todos os pedidos no banco de dados: ${error}`);
         throw new ServiceException(`Erro ao buscar todos os pedidos no banco de dados: ${error}`);
      });

      const pedidosNaoFinalizados = pedidos.filter((pedido) =>
         estadosDePedidoParaListagem.includes(pedido.estadoPedido),
      );

      const pedidosNaoFinalizadosOrdenados = pedidosNaoFinalizados.sort(this.ordenarPorEstadoDoPedido);

      return pedidosNaoFinalizadosOrdenados;
   }
}
