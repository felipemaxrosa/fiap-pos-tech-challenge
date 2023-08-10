import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Injectable, Logger } from '@nestjs/common';

import { IRepository } from '../../../../domain/repository/repository';
import { ItemPedido } from '../../../../domain/item-pedido/model/item-pedido.model';
import { RepositoryException } from '../../../../infrastructure/exception/repository.exception';
import { ItemPedidoEntity } from '../entity/item-pedido.entity';

@Injectable()
export class ItemPedidoTypeormRepository implements IRepository<ItemPedido> {
   private logger = new Logger(ItemPedidoTypeormRepository.name);

   constructor(
      @InjectRepository(ItemPedidoEntity)
      private repository: Repository<ItemPedidoEntity>,
   ) {}

   async findBy(attributes: Partial<ItemPedido>): Promise<ItemPedido[]> {
      this.logger.debug(`Realizando consulta de items do pedido: com os parâmetros ${JSON.stringify(attributes)}`);

      return this.repository
         .findBy(attributes)
         .then((ItemPedido) => {
            this.logger.debug(
               `Consulta de items do pedido realizada com sucesso com os parâmetros ${JSON.stringify(attributes)}`,
            );

            return ItemPedido;
         })
         .catch((error) => {
            throw new RepositoryException(
               `Houve um erro ao buscar os items do pedido com os parâmetros: '${JSON.stringify(attributes)}': ${
                  error.message
               }`,
            );
         });
   }

   async save(itemPedido: ItemPedido): Promise<ItemPedido> {
      this.logger.debug(`Adicionando novo item ao pedido: ${itemPedido}`);
      return this.repository
         .save(itemPedido)
         .then((itemSalvo) => {
            this.logger.debug(`Novo item do pedido salvo com sucesso no banco de dados: ${itemSalvo.id}`);
            return itemSalvo;
         })
         .catch((error) => {
            throw new RepositoryException(
               `Houve um erro ao salvar o novo item do pedido no banco de dados: '${itemPedido}': ${error.message}`,
            );
         });
   }

   async edit(itemPedido: ItemPedido): Promise<ItemPedido> {
      this.logger.debug(`Editando item do pedido: ${itemPedido}`);
      const { id, ...itemParaEdicao } = itemPedido;

      return this.repository
         .update({ id }, itemParaEdicao)
         .then((itemEditado) => {
            this.logger.debug(`Item do pedido editado com sucesso no banco de dados`);

            if (itemEditado.affected > 0) {
               return itemPedido;
            }
         })
         .catch((error) => {
            throw new RepositoryException(
               `Houve um erro ao editar o item do pedido no banco de dados: '${itemPedido}': ${error.message}`,
            );
         });
   }

   async delete(id: number): Promise<boolean> {
      this.logger.debug(`Deletando logicamente pedido id: ${id}`);
      const pedido = (await this.findBy({ id }))[0];
      // pedido.ativo = false;

      return this.repository
         .delete({ pedidoId: id })
         .then(() => {
            this.logger.debug(`Pedido deletado logicamente com sucesso no banco de dados: ${pedido.id}`);
            return true;
         })
         .catch((error) => {
            throw new RepositoryException(
               `Houve um erro ao deletar logicamente o pedido no banco de dados: '${pedido}': ${error.message}`,
            );
         });
   }

   findAll(): Promise<ItemPedido[]> {
      throw new RepositoryException('Método não implementado.');
   }
}
