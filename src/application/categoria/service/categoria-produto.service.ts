import { Inject, Injectable, Logger } from '@nestjs/common';
import { ICategoriaProdutoService } from 'src/application/categoria/service/categoria-produto.service.interface';
import { CategoriaProduto } from 'src/enterprise/categoria/model/categoria-produto.model';
import { ServiceException } from 'src/enterprise/exception/service.exception';
import { IRepository } from 'src/enterprise/repository/repository';
import { CategoriaProdutoConstants } from 'src/shared/constants';


@Injectable()
export class CategoriaProdutoService implements ICategoriaProdutoService {
   private logger: Logger = new Logger(CategoriaProdutoService.name);

   constructor(@Inject(CategoriaProdutoConstants.IREPOSITORY) private repository: IRepository<CategoriaProduto>) {}

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
