import { Injectable, Logger } from '@nestjs/common';

import { Produto } from '../../../../domain/produto/model/produto.model';
import { IRepository } from '../../../../domain/repository/repository';
import { RepositoryException } from '../../../exception/repository.exception';

// The ids' values are coming as string from the request, whereas they should be numbers.
function convertIdtoNumberTypeIfPresent(attributes: any, fieldWithIdContent: string): any {
   if (!attributes[fieldWithIdContent]) return attributes;
   return { ...attributes, [fieldWithIdContent]: Number(attributes[fieldWithIdContent]) };
}

@Injectable()
export class ProdutoMemoryRepository implements IRepository<Produto> {
   private logger: Logger = new Logger(ProdutoMemoryRepository.name);

   private repository: Array<Produto> = [];
   private static ID_COUNT = 0;

   async findBy(attributes: any): Promise<Produto[]> {
      this.logger.debug(`Realizando consulta de produto: com os parâmetros ${JSON.stringify(attributes)}`);
      let attributesWithConvertedIds = convertIdtoNumberTypeIfPresent(attributes, 'id');
      attributesWithConvertedIds = convertIdtoNumberTypeIfPresent(attributesWithConvertedIds, 'idCategoriaProduto');
      return new Promise((resolve) => {
         resolve(
            this.repository.filter((produto) => {
               return Object.entries(attributesWithConvertedIds).every(([key, value]) => {
                  return produto[key] == value;
               });
            }),
         );
      });
   }

   async save(produto: Produto): Promise<Produto> {
      this.logger.debug(`Salvando produto: ${produto}`);
      return new Promise<Produto>((resolve) => {
         produto.id = ++ProdutoMemoryRepository.ID_COUNT;
         this.repository.push(produto);
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

   findAll(): Promise<Produto[]> {
      throw new RepositoryException('Método não implementado.');
   }
}
