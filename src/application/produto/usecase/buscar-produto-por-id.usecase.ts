import { Inject, Injectable, Logger } from '@nestjs/common';
import { ServiceException } from 'src/enterprise/exception/service.exception';
import { Produto } from 'src/enterprise/produto/model/produto.model';
import { IRepository } from 'src/enterprise/repository/repository';
import { ProdutoConstants } from 'src/shared/constants';

@Injectable()
export class BuscarProdutoPorIdUseCase {
   private logger = new Logger(BuscarProdutoPorIdUseCase.name);

   constructor(@Inject(ProdutoConstants.IREPOSITORY) private repository: IRepository<Produto>) {}

   async buscarProdutoPorID(id: number): Promise<Produto> {
      const produtos = await this.repository.findBy({ id: id }).catch((error) => {
         this.logger.error(`Erro ao buscar produto id=${id} no banco de dados: ${error}`);
         throw new ServiceException(`Erro ao buscar produto id=${id} no banco de dados: ${error}`);
      });
      if (produtos.length > 0) {
         return produtos[0];
      }
   }
}
