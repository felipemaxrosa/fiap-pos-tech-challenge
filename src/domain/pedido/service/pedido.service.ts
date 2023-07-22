import { Inject, Injectable, Logger } from '@nestjs/common';

import { Pedido } from '../model/pedido.model';
import { ServiceException } from 'src/domain/exception/service.exception';
import { PedidoConstants } from 'src/shared/constants';
import { SalvarPedidoValidator } from '../validation/salvar-pedido.validator';
import { IPedidoService } from './pedido.service.interface';
import { EstadoPedido } from '../enums/pedido';
import { IPedidoRepository } from '../repository/pedido.repository.interface';

@Injectable()
export class PedidoService implements IPedidoService {
   private logger = new Logger(PedidoService.name);

   constructor(
      @Inject(PedidoConstants.IREPOSITORY) private repository: IPedidoRepository,
      @Inject(PedidoConstants.SALVAR_PEDIDO_VALIDATOR)
      private validators: SalvarPedidoValidator[],
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

   async findAllByEstadoDoPedido(estado: EstadoPedido): Promise<Pedido[]> {
      const pedidos = await this.repository.findBy({ estadoPedido: estado }).catch((error) => {
         this.logger.error(`Erro ao buscar produtos com estadoPedido=${estado} no banco de dados: ${error}`);
         throw new ServiceException(`Erro ao buscar produtos com estadoPedido=${estado} no banco de dados: ${error}`);
      });

      return pedidos;
   }

   async listarPedidosPendentes(): Promise<Pedido[]> {
      const pedidos = await this.repository.listarPedidosPendentes().catch((error) => {
         this.logger.error(`Erro ao buscar pedidos pendentes no banco de dados: ${error}`);
         throw new ServiceException(`Erro ao buscar pedidos pendentes no banco de dados: ${error}`);
      });

      return pedidos;
   }
}
