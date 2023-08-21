import { Injectable } from '@nestjs/common';
import { CategoriaProduto } from 'src/enterprise/categoria/model/categoria-produto.model';
import { IRepository } from 'src/enterprise/repository/repository';
import { RepositoryException } from 'src/infrastructure/exception/repository.exception';

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
