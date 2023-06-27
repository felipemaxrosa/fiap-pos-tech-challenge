import { Inject, Injectable, Logger } from '@nestjs/common';

import { Pedido } from '../model/pedido.model';
import { IRepository } from 'src/domain/repository/repository';
import { ServiceException } from 'src/domain/exception/service.exception';
import { PedidoConstants } from 'src/shared/constants';
import { CriarNovoPedidoValidator } from '../validation/criar-novo-pedido.validator';
import { IPedidoService } from './pedido.service.interface';
import { EstadoPedido } from '../enums/pedido';

@Injectable()
export class PedidoService implements IPedidoService {
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

   async findById(id: number): Promise<Pedido> {
      return await this.repository
         .findBy({ id })
         .then((pedidos) => {
            return pedidos[0];
         })
         .catch((error) => {
            this.logger.error(`Erro ao consultar pedido no banco de dados: ${error} `);
            throw new ServiceException(`Houve um erro ao consultar o pedido: ${error}`);
         });
   }

   async findByIdEstadoDoPedido(pedidoId: number): Promise<{ estadoPedido: EstadoPedido }> {
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
