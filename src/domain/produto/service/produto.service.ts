import { Inject, Injectable, Logger } from '@nestjs/common';
import { Produto } from 'src/domain/Produto/model/produto.model';
import { IService } from 'src/domain/service/service';
import { SalvarProdutoValidator } from 'src/domain/produto/validation/salvar-produto.validator';
import { IRepository } from 'src/domain/repository/repository';
import { ServiceException } from '../../exception/service.exception';

@Injectable()
export class ProdutoService implements IService<Produto> {
   private logger: Logger = new Logger(ProdutoService.name);

   constructor(
      @Inject('IRepository<Produto>') private repository: IRepository<Produto>,
      @Inject('SalvarProdutoValidator')
      private validators: SalvarProdutoValidator[],
   ) {}

   async save(produto: Produto): Promise<Produto> {
      await this.validate(produto);

      return await this.repository
         .save({
            nome: produto.nome,
            idCategoriaProduto: produto.idCategoriaProduto,
            descricao: produto.descricao,
            preco: produto.preco,
            imagemBase64: produto.imagemBase64,
            ativo: produto.ativo,
         })
         .catch((error) => {
            this.logger.error(`Erro ao salvar no banco de dados: ${error} `);
            throw new ServiceException(`Houve um erro ao salvar o produto: ${error}`);
         });
   }

   async edit(produto: Produto): Promise<Produto> {
      await this.validate(produto);
      return await this.repository
         .edit({
            id: produto.id,
            nome: produto.nome,
            idCategoriaProduto: produto.idCategoriaProduto,
            descricao: produto.descricao,
            preco: produto.preco,
            imagemBase64: produto.imagemBase64,
            ativo: produto.ativo,
         })
         .catch((error) => {
            this.logger.error(`Erro ao editar no banco de dados: ${error} `);
            throw new ServiceException(`Houve um erro ao editar o produto: ${error}`);
         });
   }

   async delete(id: number): Promise<boolean> {
      return await this.repository.delete(id).catch((error) => {
         this.logger.error(`Erro ao deletar no banco de dados: ${error} `);
         throw new ServiceException(`Houve um erro ao deletar o produto: ${error}`);
      });
   }

   private async validate(produto: Produto): Promise<void> {
      for (const validator of this.validators) {
         await validator.validate(produto);
      }
   }
}
