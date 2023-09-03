import { Inject, Injectable, Logger } from '@nestjs/common';
import { ServiceException } from 'src/enterprise/exception/service.exception';
import { EstadoPedido } from 'src/enterprise/pedido/enums/pedido';
import { Pedido } from 'src/enterprise/pedido/model/pedido.model';
import { IPedidoRepository } from 'src/enterprise/pedido/repository/pedido.repository.interface';
import { PedidoConstants } from 'src/shared/constants';

@Injectable()
export class BuscarTodosPedidosNaoFinalizadosUseCase {
   private logger = new Logger(BuscarTodosPedidosNaoFinalizadosUseCase.name);

   constructor(@Inject(PedidoConstants.IREPOSITORY) private repository: IPedidoRepository) {}

   async buscarTodosPedidos(): Promise<Pedido[]> {
      return await this.repository
         .find({
            where: [
               { estadoPedido: EstadoPedido.RECEBIDO },
               { estadoPedido: EstadoPedido.EM_PREPARACAO },
               { estadoPedido: EstadoPedido.PRONTO },
            ],
            order: {
               estadoPedido: 'DESC',
            },
            relations: ['itensPedido', 'itensPedido.produto'],
         })
         .then((pedidos) => {
            return pedidos;
         })
         .catch((error) => {
            this.logger.error(`Erro ao buscar todos pedidos no banco de dados: ${error} `);
            throw new ServiceException(`Houve um erro ao buscar os pedidos: ${error}`);
         });
   }
}
