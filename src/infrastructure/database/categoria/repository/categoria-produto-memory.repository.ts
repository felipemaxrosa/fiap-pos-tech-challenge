import { Injectable } from '@nestjs/common';

import { IRepository } from '../../../../domain/repository/repository';
import { RepositoryException } from '../../../exception/repository.exception';
import { CategoriaProduto } from '../../../../domain/categoria/model/categoria-produto.model';

@Injectable()
export class CategoriaProdutoMemoryRepository implements IRepository<CategoriaProduto> {

   private repository: Array<CategoriaProduto> = [
      { id: 1, nome: 'Lanche' },
      { id: 2, nome: 'Acompanhamento' },
      { id: 3, nome: 'Bebida' },
      { id: 4, nome: 'Sobremesa' },
   ];

   async findBy(): Promise<CategoriaProduto[]> {
      throw new RepositoryException('Método não implementado.');
   }

   async save(): Promise<CategoriaProduto> {
      throw new RepositoryException('Método não implementado.');
   }

   edit(): Promise<CategoriaProduto> {
      throw new RepositoryException('Método não implementado.');
   }

   delete(): Promise<boolean> {
      throw new RepositoryException('Método não implementado.');
   }

   async findAll(): Promise<CategoriaProduto[]> {
      return this.repository;
   }
}
