import { Inject, Injectable, Logger } from '@nestjs/common';

import { Pedido } from '../model/pedido.model';
import { IService } from 'src/domain/service/service';
import { IRepository } from 'src/domain/repository/repository';
import { ServiceException } from 'src/domain/exception/service.exception';
import { PedidoConstants } from 'src/shared/constants';
import { CriarNovoPedidoValidator } from '../validation/criar-novo-pedido.validator';

@Injectable()
export class PedidoService implements IService<Pedido> {
   private logger = new Logger(PedidoService.name);

   constructor(
      @Inject(PedidoConstants.IREPOSITORY) private repository: IRepository<Pedido>,
      @Inject('CriarNovoPedidoValidator')
      private validators: CriarNovoPedidoValidator[],
   ) {}

   async save(pedido: Pedido): Promise<Pedido> {
      for (const validator of this.validators) {
         await validator.validate(pedido);
      }

      return await this.repository
         .save(pedido)
         .then((novoPedido) => novoPedido)
         .catch((error) => {
            this.logger.error(`Erro ao salvar no banco de dados: ${error} `);
            throw new ServiceException(`Houve um erro ao criar novo pedido: ${error}`);
         });
   }

   async edit(pedido: Pedido): Promise<Pedido> {
      for (const validator of this.validators) {
         await validator.validate(pedido);
      }

      return await this.repository
         .edit(pedido)
         .then((pedidoEditado) => pedidoEditado)
         .catch((error) => {
            this.logger.error(`Erro ao editar no banco de dados: ${error} `);
            throw new ServiceException(`Houve um erro ao editar pedido: ${error}`);
         });
   }

   async delete(pedidoId: number): Promise<boolean> {
      return await this.repository
         .delete(pedidoId)
         .then(() => true)
         .catch((error) => {
            this.logger.error(`Erro ao deletar no banco de dados: ${error} `);
            throw new ServiceException(`Houve um erro ao deletar o produto: ${error}`);
         });
   }

   findById(): Promise<Pedido> {
      throw new ServiceException('Método não implementado.');
   }
}
