import { Inject, Injectable, Logger } from '@nestjs/common';
import { PersistirProdutoValidator } from 'src/application/produto/validation/persistir-produto.validator';
import { ValidationException } from 'src/enterprise/exception/validation.exception';
import { Produto } from 'src/enterprise/produto/model/produto.model';
import { IRepository } from 'src/enterprise/repository/repository';
import { ProdutoConstants } from 'src/shared/constants';

@Injectable()
export class NomeUnicoProdutoValidator implements PersistirProdutoValidator {
   public static CAMPOS_INVALIDOS_ERROR_MESSAGE = 'Já existe um produto ativo com o nome informado';

   private logger: Logger = new Logger(NomeUnicoProdutoValidator.name);

   constructor(@Inject(ProdutoConstants.IREPOSITORY) private repository: IRepository<Produto>) {}

   async validate(produto: Produto): Promise<boolean> {
      this.logger.log(
         `Inicializando validação ${NomeUnicoProdutoValidator.name} para persistir o produto: ${produto.nome}`,
      );

      await this.repository.findBy({ nome: produto.nome, ativo: true }).then((produtos) => {
         // Cobre tanto o caso de atualização de produto quanto de criação de produto. Se for edição, o nome pode ser
         // igual porque será igual a si mesmo
         if (produtos.length === 1 && produtos[0].id !== produto.id) {
            this.logger.error(
               `O nome de um produto tem que ser único e este nome já está registrado no banco: ${produto.nome}`,
            );
            throw new ValidationException(NomeUnicoProdutoValidator.CAMPOS_INVALIDOS_ERROR_MESSAGE);
         }
      });

      this.logger.debug(`${NomeUnicoProdutoValidator.name} finalizado com sucesso para o produto: ${produto.nome}`);
      return true;
   }
}
