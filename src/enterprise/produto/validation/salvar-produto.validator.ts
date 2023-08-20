import { Produto } from "src/enterprise/produto/model/produto.model";
import { IValidator } from "src/enterprise/validation/validator";

export type SalvarProdutoValidator = IValidator<Produto>;
