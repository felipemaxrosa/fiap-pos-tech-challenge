import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Injectable, Logger } from '@nestjs/common';
import { Pagamento } from 'src/enterprise/pagamento/model/pagamento.model';
import { RepositoryException } from 'src/infrastructure/exception/repository.exception';
import { PagamentoEntity } from 'src/infrastructure/persistence/pagamento/entity/pagamento.entity';
import { IRepository } from 'src/enterprise/repository/repository';

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

   async delete(id: number): Promise<boolean> {
      // TODO - Precisa implementar
      return true;
   }

   async edit(pagamento: Pagamento): Promise<Pagamento> {
      // TODO - Precisa implementar
      return {} as Pagamento;
   }

   async save(type: Pagamento): Promise<Pagamento> {
      // TODO - Precisa implementar
      return {} as Pagamento;
   }

   async findAll(): Promise<Pagamento[]> {
      // TODO - Precisa implementar
      return [] as Pagamento[];
   }
}
