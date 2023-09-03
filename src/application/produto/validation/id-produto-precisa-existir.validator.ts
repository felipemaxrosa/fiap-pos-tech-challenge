import { Inject, Injectable, Logger } from '@nestjs/common';
import { PersistirProdutoValidator } from 'src/application/produto/validation/persistir-produto.validator';
import { ValidationException } from 'src/enterprise/exception/validation.exception';
import { Produto } from 'src/enterprise/produto/model/produto.model';
import { IRepository } from 'src/enterprise/repository/repository';
import { ProdutoConstants } from 'src/shared/constants';

@Injectable()
export class IdProdutoPrecisaExistirValidator implements PersistirProdutoValidator {
   public static ID_INEXISTENTE_ERROR_MESSAGE = 'Código de produto inexistente';

   private logger: Logger = new Logger(IdProdutoPrecisaExistirValidator.name);

   constructor(@Inject(ProdutoConstants.IREPOSITORY) private repository: IRepository<Produto>) {}

   async validate(produto: Produto): Promise<boolean> {
      this.logger.log(
         `Inicializando validação ${IdProdutoPrecisaExistirValidator.name} para modificar o produto: ${produto.id}`,
      );

      await this.repository.findBy({ id: produto.id }).then((produtos) => {
         if (produtos.length !== 1) {
            this.logger.error(`Código de produto inexistente: ${produto.id}`);
            throw new ValidationException(IdProdutoPrecisaExistirValidator.ID_INEXISTENTE_ERROR_MESSAGE);
         }
      });

      this.logger.debug(
         `${IdProdutoPrecisaExistirValidator.name} finalizado com sucesso para o produto id: ${produto.id}`,
      );
      return true;
   }
}
