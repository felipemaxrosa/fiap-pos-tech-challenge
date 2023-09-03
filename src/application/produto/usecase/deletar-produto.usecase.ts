import { Inject, Injectable, Logger } from '@nestjs/common';
import { IdProdutoPrecisaExistirValidator } from 'src/application/produto/validation/id-produto-precisa-existir.validator';
import { PersistirProdutoValidator } from 'src/application/produto/validation/persistir-produto.validator';
import { ServiceException } from 'src/enterprise/exception/service.exception';
import { ValidationException } from 'src/enterprise/exception/validation.exception';
import { Produto } from 'src/enterprise/produto/model/produto.model';
import { IRepository } from 'src/enterprise/repository/repository';
import { ProdutoConstants } from 'src/shared/constants';
import { ValidatorUtils } from 'src/shared/validator.utils';

@Injectable()
export class DeletarProdutoUseCase {
   private logger = new Logger(DeletarProdutoUseCase.name);

   constructor(
      @Inject(ProdutoConstants.IREPOSITORY) private repository: IRepository<Produto>,
      @Inject(ProdutoConstants.EDITAR_PRODUTO_VALIDATOR) private validators: PersistirProdutoValidator[],
   ) {}

   async deletarProduto(id: number): Promise<boolean> {
      const produto = await this.repository.findBy({ id: id }).then((produtos) => produtos[0]);
      if (produto === undefined) {
         throw new ValidationException(IdProdutoPrecisaExistirValidator.ID_INEXISTENTE_ERROR_MESSAGE);
      }
      await ValidatorUtils.executeValidators(this.validators, produto);

      return await this.repository.delete(id).catch((error) => {
         this.logger.error(`Erro ao deletar no banco de dados: ${error} `);
         throw new ServiceException(`Houve um erro ao deletar o produto: ${error}`);
      });
   }
}
