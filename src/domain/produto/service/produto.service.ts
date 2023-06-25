import { Inject, Injectable, Logger } from '@nestjs/common';
import { Produto } from 'src/domain/produto/model/produto.model';
import { SalvarProdutoValidator } from 'src/domain/produto/validation/salvar-produto.validator';
import { IRepository } from 'src/domain/repository/repository';
import { ServiceException } from '../../exception/service.exception';
import { IProdutoService } from './produto.service.interface';

@Injectable()
export class ProdutoService implements IProdutoService {
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

   async findById(id: number): Promise<Produto> {
      const produtos = await this.repository.findBy({ id: id }).catch((error) => {
         this.logger.error(`Erro ao buscar produto id=${id} no banco de dados: ${error}`);
         throw new ServiceException(`Erro ao buscar produto id=${id} no banco de dados: ${error}`);
      });
      if (produtos.length > 0) {
         return produtos[0];
      }
   }

   async findByIdCategoriaProduto(idCategoriaProduto: number): Promise<Produto[]> {
      const produtos = await this.repository.findBy({ idCategoriaProduto: idCategoriaProduto }).catch((error) => {
         this.logger.error(
            `Erro ao buscar produto idCategoriaProduto=${idCategoriaProduto} no banco de dados: ${error}`,
         );
         throw new ServiceException(
            `Erro ao buscar produto idCategoriaProduto=${idCategoriaProduto} no banco de dados: ${error}`,
         );
      });
      if (produtos.length > 0) {
         return produtos;
      }
   }

   private async validate(produto: Produto): Promise<void> {
      for (const validator of this.validators) {
         await validator.validate(produto);
      }
   }
}
