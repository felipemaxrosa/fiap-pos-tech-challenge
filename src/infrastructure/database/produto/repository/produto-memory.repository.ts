import { Injectable, Logger } from '@nestjs/common';

import { Produto } from '../../../../domain/produto/model/produto.model';
import { IRepository } from '../../../../domain/repository/repository';

@Injectable()
export class ProdutoMemoryRepository implements IRepository<Produto> {
   private logger: Logger = new Logger(ProdutoMemoryRepository.name);

   private repository: Array<Produto> = [];
   private static ID_COUNT = 0;

   async findBy(attributes: any): Promise<Produto[]> {
      this.logger.debug(`Realizando consulta de produto: com os parâmetros ${JSON.stringify(attributes)}`);
      return new Promise((resolve) => {
         resolve(
            this.repository.filter((produto) => {
               return Object.entries(attributes).every(([key, value]) => {
                  return produto[key] === value;
               });
            }),
         );
      });
   }

   async save(produto: Produto): Promise<Produto> {
      this.logger.debug(`Salvando produto: ${produto}`);
      return new Promise<Produto>((resolve) => {
         this.repository.push(produto);
         produto.id = ++ProdutoMemoryRepository.ID_COUNT;
         resolve(produto);
      });
   }

   async edit(produto: Produto): Promise<Produto> {
      return new Promise<Produto>((resolve) => {
         this.repository[produto.id - 1] = produto;
         resolve(produto);
      });
   }

   async delete(id: number): Promise<boolean> {
      return new Promise<boolean>((resolve) => {
         const produto = this.repository[id - 1];
         produto.ativo = false;
         resolve(true);
      });
   }
}
