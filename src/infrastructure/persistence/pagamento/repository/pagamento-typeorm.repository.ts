import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Pagamento } from 'src/enterprise/pagamento/model/pagamento.model';
import { IRepository } from 'src/enterprise/repository/repository';
import { RepositoryException } from 'src/infrastructure/exception/repository.exception';
import { PagamentoEntity } from 'src/infrastructure/persistence/pagamento/entity/pagamento.entity';
import { Repository } from 'typeorm';

@Injectable()
export class PagamentoTypeormRepository implements IRepository<Pagamento> {
   private logger = new Logger(PagamentoTypeormRepository.name);

   constructor(
      @InjectRepository(PagamentoEntity)
      private repository: Repository<PagamentoEntity>,
   ) {}

   async findBy(attributes: any): Promise<Pagamento[]> {
      this.logger.debug(`Realizando consulta de pagamento: com os parâmetros ${JSON.stringify(attributes)}`);

      return this.repository
         .findBy(attributes)
         .then((pagamentosEntities) => {
            this.logger.debug(
               `Consulta de pagamentos realizada com sucesso com os parâmetros: '${JSON.stringify(attributes)}'`,
            );

            return pagamentosEntities;
         })
         .catch((error) => {
            throw new RepositoryException(
               `Houve um erro ao buscar os pagamentos com os parâmetros: '${JSON.stringify(attributes)}': ${
                  error.message
               }`,
            );
         });
   }

   async delete(): Promise<boolean> {
      throw new RepositoryException('Método não implementado.');
   }

   async edit(pagamento: Pagamento): Promise<Pagamento> {
      this.logger.debug(`Editando pagamento: ${pagamento}`);

      return this.repository
         .save(pagamento)
         .then((pagamentoEditado) => {
            this.logger.debug(`Pagamento editado com sucesso no banco de dados: ${pagamentoEditado.id}`);

            return pagamentoEditado;
         })
         .catch((error) => {
            throw new RepositoryException(
               `Houve um erro ao editar o pagamento no banco de dados: '${pagamento}': ${error.message}`,
            );
         });
   }

   async save(pagamento: Pagamento): Promise<Pagamento> {
      this.logger.debug(`Salvando pagamento: ${pagamento}`);
      return this.repository
         .save({
            pedidoId: pagamento.id,
            transacaoId: pagamento.transacaoId,
            estadoPagamento: pagamento.estadoPagamento,
            total: pagamento.total,
            dataHoraPagamento: pagamento.dataHoraPagamento,
         })
         .then((pagamentoEntity) => {
            this.logger.debug(`Pagamento salvo com sucesso no banco de dados: ${pagamentoEntity.id}`);
            return {
               id: pagamentoEntity.id,
               pedidoId: pagamentoEntity.pedidoId,
               transacaoId: pagamentoEntity.transacaoId,
               estadoPagamento: pagamentoEntity.estadoPagamento,
               total: pagamentoEntity.total,
               dataHoraPagamento: pagamentoEntity.dataHoraPagamento,
            };
         })
         .catch((error) => {
            throw new RepositoryException(
               `Houve um erro ao salvar o pagamento no banco de dados: '${pagamento}': ${error.message}`,
            );
         });
   }

   async findAll(): Promise<Pagamento[]> {
      throw new RepositoryException('Método não implementado.');
   }
}
