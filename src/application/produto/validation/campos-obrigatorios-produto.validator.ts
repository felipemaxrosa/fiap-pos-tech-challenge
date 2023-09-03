import { Inject, Injectable, Logger } from '@nestjs/common';
import { PersistirProdutoValidator } from 'src/application/produto/validation/persistir-produto.validator';
import { ValidationException } from 'src/enterprise/exception/validation.exception';
import { Produto } from 'src/enterprise/produto/model/produto.model';
import { IRepository } from 'src/enterprise/repository/repository';
import { ProdutoConstants } from 'src/shared/constants';

@Injectable()
export class CamposObrigatoriosProdutoValidator implements PersistirProdutoValidator {
   private static readonly VALID_ID_CATEGORIA_PRODUTO = [1, 2, 3, 4];

   public static CAMPOS_INVALIDOS_ERROR_MESSAGE =
      'Os seguintes campos são obrigatórios e não podem ter conteúdo vazio ou inválido: nome, idCategoriaProduto, e preço';

   public static ID_CATEGORIA_PRODUTO_INVALIDO_ERROR_MESSAGE = `O campo idCategoriaProduto só aceita os seguintes valores: ${CamposObrigatoriosProdutoValidator.VALID_ID_CATEGORIA_PRODUTO}`;

   private logger: Logger = new Logger(CamposObrigatoriosProdutoValidator.name);

   constructor(@Inject(ProdutoConstants.IREPOSITORY) private repository: IRepository<Produto>) {}

   async validate(produto: Produto): Promise<boolean> {
      this.logger.log(
         `Inicializando validação ${CamposObrigatoriosProdutoValidator.name} para persistir o produto: ${produto.nome}`,
      );

      if (!produto.nome.trim() || !produto.idCategoriaProduto || produto.preco <= 0) {
         throw new ValidationException(CamposObrigatoriosProdutoValidator.CAMPOS_INVALIDOS_ERROR_MESSAGE);
      }

      if (!CamposObrigatoriosProdutoValidator.VALID_ID_CATEGORIA_PRODUTO.includes(produto.idCategoriaProduto)) {
         throw new ValidationException(CamposObrigatoriosProdutoValidator.ID_CATEGORIA_PRODUTO_INVALIDO_ERROR_MESSAGE);
      }

      this.logger.debug(
         `${CamposObrigatoriosProdutoValidator.name} finalizado com sucesso para produto: ${produto.nome}`,
      );
      return true;
   }
}
