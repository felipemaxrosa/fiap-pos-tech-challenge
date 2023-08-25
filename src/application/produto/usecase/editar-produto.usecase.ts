import { Inject, Injectable, Logger } from '@nestjs/common';
import { ServiceException } from 'src/enterprise/exception/service.exception';
import { Produto } from 'src/enterprise/produto/model/produto.model';
import { SalvarProdutoValidator } from 'src/application/produto/validation/salvar-produto.validator';
import { IRepository } from 'src/enterprise/repository/repository';
import { ProdutoConstants } from 'src/shared/constants';
import { ValidatorUtils } from 'src/shared/validator.utils';

@Injectable()
export class EditarProdutoUseCase {
   private logger = new Logger(EditarProdutoUseCase.name);

   constructor(
      @Inject(ProdutoConstants.IREPOSITORY) private repository: IRepository<Produto>,
      @Inject(ProdutoConstants.SALVAR_PRODUTO_VALIDATOR) private validators: SalvarProdutoValidator[],
   ) {}

   async editarProduto(produto: Produto): Promise<Produto> {
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
}
