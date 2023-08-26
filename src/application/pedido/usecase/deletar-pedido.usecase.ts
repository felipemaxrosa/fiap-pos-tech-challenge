import { Inject, Injectable, Logger } from '@nestjs/common';
import { ServiceException } from 'src/enterprise/exception/service.exception';
import { IPedidoRepository } from 'src/enterprise/pedido/repository/pedido.repository.interface';
import { PedidoConstants } from 'src/shared/constants';

@Injectable()
export class DeletarPedidoUseCase {
   private logger = new Logger(DeletarPedidoUseCase.name);

   constructor(@Inject(PedidoConstants.IREPOSITORY) private repository: IPedidoRepository) {}

   async deletarPedido(pedidoId: number): Promise<boolean> {
      return await this.repository
         .delete(pedidoId)
         .then(() => true)
         .catch((error) => {
            this.logger.error(`Erro ao deletar no banco de dados: ${error} `);
            throw new ServiceException(`Houve um erro ao deletar o produto: ${error}`);
         });
   }
}
