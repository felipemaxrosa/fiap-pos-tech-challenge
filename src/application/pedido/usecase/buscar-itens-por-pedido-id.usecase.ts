import { Inject, Injectable, Logger } from '@nestjs/common';
import { ServiceException } from 'src/enterprise/exception/service.exception';
import { ItemPedido } from 'src/enterprise/item-pedido/model';
import { IRepository } from 'src/enterprise/repository/repository';
import { ItemPedidoConstants } from 'src/shared/constants';

@Injectable()
export class BuscarItensPorPedidoIdUseCase {
   private logger = new Logger(BuscarItensPorPedidoIdUseCase.name);

   constructor(@Inject(ItemPedidoConstants.IREPOSITORY) private itemPedidoRepository: IRepository<ItemPedido>) {}

   async buscarItensPedidoPorPedidoId(id: number): Promise<ItemPedido[]> {
      return await this.itemPedidoRepository
         .findBy({ pedidoId: id })
         .then((itens: ItemPedido[]) => {
            return itens;
         })
         .catch((error) => {
            this.logger.error(`Erro ao buscar itens de um pedido no banco de dados: ${error} `);
            throw new ServiceException(`Houve um erro ao buscar os itens do pedido: ${error}`);
         });
   }
}
