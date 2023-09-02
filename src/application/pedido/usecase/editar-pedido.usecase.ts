import { Inject, Injectable, Logger } from '@nestjs/common';
import { ServiceException } from 'src/enterprise/exception/service.exception';
import { Pedido } from 'src/enterprise/pedido/model/pedido.model';
import { IPedidoRepository } from 'src/enterprise/pedido/repository/pedido.repository.interface';
import { PedidoConstants } from 'src/shared/constants';
import { EditarPedidoValidator } from 'src/application/pedido/validation/editar-pedido.validator';

@Injectable()
export class EditarPedidoUseCase {
   private logger = new Logger(EditarPedidoUseCase.name);

   constructor(
      @Inject(PedidoConstants.IREPOSITORY) private repository: IPedidoRepository,
      @Inject(PedidoConstants.EDITAR_PEDIDO_VALIDATOR)
      private validators: EditarPedidoValidator[],
   ) {}

   async editarPedido(pedido: Pedido): Promise<Pedido> {
      return await this.repository
         .edit(pedido)
         .then((pedidoEditado) => pedidoEditado)
         .catch((error) => {
            this.logger.error(`Erro ao editar no banco de dados: ${error} `);
            throw new ServiceException(`Houve um erro ao editar pedido: ${error}`);
         });
   }
}
