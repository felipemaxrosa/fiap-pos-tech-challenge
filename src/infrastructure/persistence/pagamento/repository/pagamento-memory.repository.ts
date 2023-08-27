import { Injectable, Logger } from '@nestjs/common';
import { Pagamento } from 'src/enterprise/pagamento/model/pagamento.model';
import { IRepository } from 'src/enterprise/repository/repository';

@Injectable()
export class PagamentoMemoryRepository implements IRepository<Pagamento> {
   private logger: Logger = new Logger(PagamentoMemoryRepository.name);

   private pagamentosRepository: Array<Pagamento> = [];
   private static ID_COUNT = 0;

   async findBy(attributes: Partial<Pagamento>): Promise<Pagamento[]> {
      this.logger.debug(`Realizando consulta de pagamentos: com os parâmetros ${JSON.stringify(attributes)}`);

      return new Promise((resolve) => {
         resolve(
            this.pagamentosRepository.filter((pagamento) => {
               return Object.entries(attributes).every(([key, value]) => {
                  return pagamento[key] === value;
               });
            }),
         );
      });
   }

   async save(pagamento: Pagamento): Promise<Pagamento> {
      this.logger.debug(`Efetuando novo pagamento: ${pagamento}`);

      return new Promise<Pagamento>((resolve) => {
         pagamento.id = ++PagamentoMemoryRepository.ID_COUNT;
         this.pagamentosRepository.push(pagamento);
         resolve(pagamento);
      });
   }

   async edit(pagamento: Pagamento): Promise<Pagamento> {
      return new Promise<Pagamento>((resolve) => {
         this.pagamentosRepository[pagamento.id - 1] = pagamento;
         resolve(pagamento);
      });
   }

   async delete(pagamentoId: number): Promise<boolean> {
      return new Promise<boolean>((resolve) => {
         this.pagamentosRepository = this.pagamentosRepository.filter((pagamento) => pagamento.id !== pagamentoId);
         resolve(true);
      });
   }

   findAll(): Promise<Pagamento[]> {
      this.logger.debug('Listando todos os pagamentos');

      return new Promise<Pagamento[]>((resolve) => {
         const pagamentos = this.pagamentosRepository;
         resolve(pagamentos);
      });
   }
}
