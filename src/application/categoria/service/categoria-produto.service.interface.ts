import { CategoriaProduto } from "src/enterprise/categoria/model/categoria-produto.model";
import { IService } from "src/enterprise/service/service";


export interface ICategoriaProdutoService extends IService<CategoriaProduto> {
   findAll(): Promise<CategoriaProduto[]>;
}
