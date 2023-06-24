import { Inject, Injectable, Logger } from '@nestjs/common';
import { ValidationException } from 'src/domain/exception/validation.exception';
import { IRepository } from 'src/domain/repository/repository';
import { SalvarProdutoValidator } from './salvar-produto.validator';
import { Produto } from '../model/produto.model';

@Injectable()
export class CamposObrigatoriosProdutoValidator implements SalvarProdutoValidator {
   // TODO RODRIGO - load from database
   private static readonly VALID_ID_CATEGORIA_PRODUTO = [1, 2, 3, 4];

   public static CAMPOS_INVALIDOS_ERROR_MESSAGE =
      'Os seguintes campos são obrigatórios e não podem ter conteúdo vazio ou inválido: nome, idCategoriaProduto, e preço';

   public static ID_CATEGORIA_PRODUTO_INVALIDO_ERROR_MESSAGE = `O campo idCategoriaProduto só aceita os seguintes valores: ${CamposObrigatoriosProdutoValidator.VALID_ID_CATEGORIA_PRODUTO}`;

   private logger: Logger = new Logger(CamposObrigatoriosProdutoValidator.name);

   constructor(@Inject('IRepository<Produto>') private repository: IRepository<Produto>) {}

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
         `${CamposObrigatoriosProdutoValidator.name} finalizado com sucesso para cliente: ${produto.nome}`,
      );
      return true;
   }
}
