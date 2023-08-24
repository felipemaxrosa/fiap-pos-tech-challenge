import { Inject, Injectable, Logger } from '@nestjs/common';
import { IProdutoService } from 'src/application/produto/service/produto.service.interface';
import { ServiceException } from 'src/enterprise/exception/service.exception';
import { Produto } from 'src/enterprise/produto/model/produto.model';
import { SalvarProdutoValidator } from 'src/application/produto/validation/salvar-produto.validator';
import { IRepository } from 'src/enterprise/repository/repository';
import { ProdutoConstants } from 'src/shared/constants';
import { ValidatorUtils } from 'src/shared/validator.utils';

@Injectable()
export class ProdutoService implements IProdutoService {
   private logger = new Logger(ProdutoService.name);

   constructor(
      @Inject(ProdutoConstants.IREPOSITORY) private repository: IRepository<Produto>,
      @Inject(ProdutoConstants.SALVAR_PRODUTO_VALIDATOR)
      private validators: SalvarProdutoValidator[],
   ) {}

   async save(produto: Produto): Promise<Produto> {
      await ValidatorUtils.executeValidators(this.validators, produto);

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
      await ValidatorUtils.executeValidators(this.validators, produto);
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
}
