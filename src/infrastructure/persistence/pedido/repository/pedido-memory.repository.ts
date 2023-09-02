import { Injectable, Logger } from '@nestjs/common';
import { EstadoPedido } from 'src/enterprise/pedido/enums/pedido';
import { Pedido } from 'src/enterprise/pedido/model/pedido.model';
import { IPedidoRepository } from 'src/enterprise/pedido/repository/pedido.repository.interface';

@Injectable()
export class PedidoMemoryRepository implements IPedidoRepository {
   private logger: Logger = new Logger(PedidoMemoryRepository.name);

   private pedidosRepository: Array<Pedido> = [];
   private static ID_COUNT = 0;

   async findBy(attributes: Partial<Pedido>): Promise<Pedido[]> {
      this.logger.debug(`Realizando consulta de pedidos: com os parâmetros ${JSON.stringify(attributes)}`);

      return new Promise((resolve) => {
         resolve(
            this.pedidosRepository.filter((pedido) => {
               return Object.entries(attributes).every(([key, value]) => {
                  return pedido[key] === value;
               });
            }),
         );
      });
   }

   async find(options: any): Promise<Pedido[]> {
      const pedidos = this.pedidosRepository.filter((pedido) => {
         return Object.entries(options).every(([key, values]: [string, any]) => {
            if (key === 'where') {
               return values.some((value) => {
                  return Object.entries(value).every(([k, v]) => {
                     return pedido[k] === v;
                  });
               });
            }
            return true;
         });
      });

      Object.entries(options).forEach(([key, value]: [string, any]) => {
         if (key === 'order') {
            Object.entries(value).forEach(([k, v]) => {
               pedidos.sort((one, other) => (v === 'ASC' ? one[k] - other[k] : other[k] - one[k]));
            });
         }
      });

      return Promise.resolve(pedidos);
   }

   async save(pedido: Pedido): Promise<Pedido> {
      this.logger.debug(`Criando novo pedido: ${pedido}`);

      return new Promise<Pedido>((resolve) => {
         pedido.id = ++PedidoMemoryRepository.ID_COUNT;
         this.pedidosRepository.push(pedido);
         resolve(pedido);
      });
   }

   async edit(pedido: Pedido): Promise<Pedido> {
      return new Promise<Pedido>((resolve) => {
         this.pedidosRepository[pedido.id - 1] = pedido;
         resolve(pedido);
      });
   }

   async delete(pedidoId: number): Promise<boolean> {
      return new Promise<boolean>((resolve) => {
         const pedido = this.pedidosRepository[pedidoId - 1];
         pedido.ativo = false;
         resolve(true);
      });
   }

   findAll(): Promise<Pedido[]> {
      this.logger.debug('Listando todos os pedidos');

      return new Promise<Pedido[]>((resolve) => {
         const pedidos = this.pedidosRepository;
         resolve(pedidos);
      });
   }

   async listarPedidosPendentes(): Promise<Pedido[]> {
      this.logger.debug('Listando pedidos pendentes');

      return new Promise<Pedido[]>((resolve) => {
         const pedidos = this.pedidosRepository.filter(
            (item) => item.estadoPedido === EstadoPedido.RECEBIDO || item.estadoPedido === EstadoPedido.EM_PREPARACAO,
         );
         resolve(pedidos);
      });
   }
}
