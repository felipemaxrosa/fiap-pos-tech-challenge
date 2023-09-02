import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Injectable, Logger } from '@nestjs/common';
import { EstadoPedido } from 'src/enterprise/pedido/enums/pedido';
import { Pedido } from 'src/enterprise/pedido/model/pedido.model';
import { IPedidoRepository } from 'src/enterprise/pedido/repository/pedido.repository.interface';
import { RepositoryException } from 'src/infrastructure/exception/repository.exception';
import { PedidoEntity } from 'src/infrastructure/persistence/pedido/entity/pedido.entity';

@Injectable()
export class PedidoTypeormRepository implements IPedidoRepository {
   private logger = new Logger(PedidoTypeormRepository.name);

   constructor(
      @InjectRepository(PedidoEntity)
      private repository: Repository<PedidoEntity>,
   ) {}

   async find(options: any): Promise<Pedido[]> {
      this.logger.debug(`Realizando consulta de pedidos: com as condições ${JSON.stringify(options)}`);
      return this.repository
         .find(options)
         .then((pedidoEntities) => {
            this.logger.debug(
               `Consulta de pedidos realizada com sucesso com as condições: '${JSON.stringify(options)}'`,
            );
            return pedidoEntities.map((pedido) => pedido);
         })
         .catch((error) => {
            throw new RepositoryException(
               `Houve um erro ao buscar os pedidos com as condições: '${JSON.stringify(options)}': ${error.message}`,
            );
         });
   }

   async findBy(attributes: any): Promise<Pedido[]> {
      this.logger.debug(`Realizando consulta de pedidos: com os parâmetros ${JSON.stringify(attributes)}`);
      return this.repository
         .findBy(attributes)
         .then((pedidoEntities) => {
            this.logger.debug(
               `Consulta de pedidos realizada com sucesso com os parâmetros: '${JSON.stringify(attributes)}'`,
            );
            return pedidoEntities.map((pedido) => pedido);
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
         .save(pedido)
         .then((pedidoSalvo) => {
            this.logger.debug(`Novo pedido salvo com sucesso no banco de dados: ${pedidoSalvo.id}`);
            return pedidoSalvo;
         })
         .catch((error) => {
            throw new RepositoryException(
               `Houve um erro ao salvar o novo pedido no banco de dados: '${pedido}': ${error.message}`,
            );
         });
   }

   async edit(pedido: Pedido): Promise<Pedido> {
      this.logger.debug(`Editando pedido: ${pedido}`);

      return this.repository
         .save(pedido)
         .then((pedidoEditado) => {
            this.logger.debug(`Pedido editado com sucesso no banco de dados: ${pedidoEditado.id}`);

            return pedidoEditado;
         })
         .catch((error) => {
            throw new RepositoryException(
               `Houve um erro ao editar o pedido no banco de dados: '${pedido}': ${error.message}`,
            );
         });
   }

   async delete(id: number): Promise<boolean> {
      this.logger.debug(`Deletando logicamente pedido id: ${id}`);
      const pedido = (await this.findBy({ id: id }))[0];
      pedido.ativo = false;

      return this.repository
         .save(pedido)
         .then((pedidoEntity) => {
            this.logger.debug(`Pedido deletado logicamente com sucesso no banco de dados: ${pedidoEntity.id}`);
            return true;
         })
         .catch((error) => {
            throw new RepositoryException(
               `Houve um erro ao deletar logicamente o pedido no banco de dados: '${pedido}': ${error.message}`,
            );
         });
   }

   async findAll(): Promise<Pedido[]> {
      this.logger.debug('Listando todos os pedidos');

      return this.repository
         .find({
            order: {
               id: 'ASC',
            },
         })
         .then((pedidoEntities) => {
            return pedidoEntities.map((pedido) => pedido);
         })
         .catch((error) => {
            throw new RepositoryException(`Houve um erro ao listar todos os pedidos: ${error.message}`);
         });
   }

   async listarPedidosPendentes(): Promise<Pedido[]> {
      this.logger.debug('Listando pedidos com pagamento pendente');

      return this.repository
         .find({
            where: [{ estadoPedido: EstadoPedido.PAGAMENTO_PENDENTE }],
            order: {
               id: 'ASC',
            },
         })
         .then((pedidoEntities) => {
            return pedidoEntities.map((pedido) => pedido);
         })
         .catch((error) => {
            throw new RepositoryException(`Houve um erro ao listar pedidos pendentes de pagamento: ${error.message}`);
         });
   }
}
