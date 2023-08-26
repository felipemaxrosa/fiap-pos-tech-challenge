import { Inject, Injectable, Logger } from '@nestjs/common';
import { ServiceException } from 'src/enterprise/exception/service.exception';
import { EstadoPedido } from 'src/enterprise/pedido/enums/pedido';
import { IPedidoRepository } from 'src/enterprise/pedido/repository/pedido.repository.interface';
import { PedidoConstants } from 'src/shared/constants';

@Injectable()
export class BuscarEstadoPedidoPorIdUseCase {
   private logger = new Logger(BuscarEstadoPedidoPorIdUseCase.name);

   constructor(@Inject(PedidoConstants.IREPOSITORY) private repository: IPedidoRepository) {}

   async buscarEstadoPedidoPorId(pedidoId: number): Promise<{ estadoPedido: EstadoPedido }> {
      const pedidos = await this.repository.findBy({ id: pedidoId }).catch((error) => {
         this.logger.error(`Erro ao buscar produto pedidoId=${pedidoId} no banco de dados: ${error}`);
         throw new ServiceException(`Erro ao buscar produto pedidoId=${pedidoId} no banco de dados: ${error}`);
      });

      if (pedidos.length > 0) {
         const pedidoEncontrado = pedidos[0];
         return {
            estadoPedido: pedidoEncontrado.estadoPedido,
         };
      }
      return;
   }
}
