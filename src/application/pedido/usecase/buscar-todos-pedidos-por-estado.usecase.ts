import { Inject, Injectable, Logger } from '@nestjs/common';
import { ServiceException } from 'src/enterprise/exception/service.exception';
import { EstadoPedido } from 'src/enterprise/pedido/enums/pedido';
import { Pedido } from 'src/enterprise/pedido/model/pedido.model';
import { IPedidoRepository } from 'src/enterprise/pedido/repository/pedido.repository.interface';
import { PedidoConstants } from 'src/shared/constants';

@Injectable()
export class BuscarTodosPedidosPorEstadoUseCase {
   private logger = new Logger(BuscarTodosPedidosPorEstadoUseCase.name);

   constructor(@Inject(PedidoConstants.IREPOSITORY) private repository: IPedidoRepository) {}

   async buscarTodosPedidosPorEstado(estado: EstadoPedido): Promise<Pedido[]> {
      const pedidos = await this.repository.findBy({ estadoPedido: estado }).catch((error) => {
         this.logger.error(`Erro ao buscar produtos com estadoPedido=${estado} no banco de dados: ${error}`);
         throw new ServiceException(`Erro ao buscar produtos com estadoPedido=${estado} no banco de dados: ${error}`);
      });

      return pedidos;
   }
}
