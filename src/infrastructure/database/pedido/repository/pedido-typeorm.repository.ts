import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Injectable, Logger } from '@nestjs/common';

import { Pedido } from 'src/domain/pedido/model/pedido.model';
import { IRepository } from 'src/domain/repository/repository';
import { PedidoEntity } from '../../pedido/entity/pedido.entity';
import { RepositoryException } from '../../../exception/repository.exception';

@Injectable()
export class PedidoTypeormRepository implements IRepository<Pedido> {
   private logger = new Logger(PedidoTypeormRepository.name);

   constructor(
      @InjectRepository(PedidoEntity)
      private repository: Repository<PedidoEntity>,
   ) {}

   async findBy(attributes: any): Promise<Pedido[]> {
      this.logger.debug(`Realizando consulta de pedidos: com os parâmetros ${JSON.stringify(attributes)}`);
      return this.repository
         .findBy(attributes)
         .then((pedidoEntities) => {
            this.logger.debug(
               `Consulta de pedidos realizada com sucesso com os parâmetros: '${JSON.stringify(attributes)}'`,
            );
            return pedidoEntities.map((pedido) => ({
               id: pedido.id,
               clienteId: pedido.clienteId,
               dataInicio: pedido.dataInicio,
               estadoPedido: pedido.estadoPedido,
            }));
         })
         .catch((error) => {
            throw new RepositoryException(
               `Houve um erro ao buscar os pedidos com os parâmetros: '${JSON.stringify(attributes)}': ${
                  error.message
               }`,
            );
         });
   }

   async save(pedido: Pedido): Promise<Pedido> {
      this.logger.debug(`Criando novo pedido: ${pedido}`);
      return this.repository
         .save({
            clienteId: pedido.clienteId,
            dataInicio: pedido.dataInicio,
            estadoPedido: pedido.estadoPedido,
         })
         .then((pedido) => {
            this.logger.debug(`Novo pedido salvo com sucesso no banco de dados: ${pedido.id}`);
            return {
               id: pedido.id,
               clienteId: pedido.clienteId,
               dataInicio: pedido.dataInicio,
               estadoPedido: pedido.estadoPedido,
            };
         })
         .catch((error) => {
            throw new RepositoryException(
               `Houve um erro ao salvar o novo pedido no banco de dados: '${pedido}': ${error.message}`,
            );
         });
   }
}
