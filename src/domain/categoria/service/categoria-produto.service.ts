import { Inject, Injectable, Logger } from '@nestjs/common';
import { IRepository } from 'src/domain/repository/repository';
import { ServiceException } from '../../exception/service.exception';
import { ICategoriaProdutoService } from './categoria-produto.service.interface';
import { CategoriaProduto } from '../model/categoria-produto.model';

@Injectable()
export class CategoriaProdutoService implements ICategoriaProdutoService {
   private logger: Logger = new Logger(CategoriaProdutoService.name);

   constructor(@Inject('IRepository<CategoriaProduto>') private repository: IRepository<CategoriaProduto>) {}

   async save(): Promise<CategoriaProduto> {
      throw new ServiceException('Método não implementado.');
   }

   async edit(): Promise<CategoriaProduto> {
      throw new ServiceException('Método não implementado.');
   }

   async delete(): Promise<boolean> {
      throw new ServiceException('Método não implementado.');
   }

   async findById(): Promise<CategoriaProduto> {
      throw new ServiceException('Método não implementado.');
   }

   async findAll(): Promise<CategoriaProduto[]> {
      const categorias = await this.repository.findAll().catch((error) => {
         this.logger.error(`Erro ao listar categorias no banco de dados: ${error}`);
         throw new ServiceException(`Erro ao listar categorias no banco de dados: ${error}`);
      });
      if (categorias.length > 0) {
         return categorias;
      }
   }
}
