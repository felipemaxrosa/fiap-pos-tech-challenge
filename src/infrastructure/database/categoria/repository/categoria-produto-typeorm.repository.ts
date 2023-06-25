import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Injectable, Logger } from '@nestjs/common';
import { CategoriaProdutoEntity } from '../entity/categoria-produto.entity';
import { RepositoryException } from '../../../exception/repository.exception';
import { CategoriaProduto } from '../../../../domain/categoria/model/categoria-produto.model';
import { IRepository } from '../../../../domain/repository/repository';

@Injectable()
export class CategoriaProdutoTypeormRepository implements IRepository<CategoriaProduto> {
   private logger: Logger = new Logger(CategoriaProdutoTypeormRepository.name);

   constructor(
      @InjectRepository(CategoriaProdutoEntity)
      private repository: Repository<CategoriaProdutoEntity>,
   ) {}

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
      const categoriasEntities = await this.repository.find({}).catch((error) => {
         this.logger.error(`Erro ao listar categorias no banco de dados: ${error}`);
         throw new RepositoryException(`Erro ao listar categorias no banco de dados: ${error}`);
      });
      return categoriasEntities.map((categoriaEntity) => ({
         id: categoriaEntity.id,
         nome: categoriaEntity.nome,
      }));
   }
}
