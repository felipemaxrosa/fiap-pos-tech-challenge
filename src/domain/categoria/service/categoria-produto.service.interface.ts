import { IService } from '../../../domain/service/service';
import { CategoriaProduto } from '../model/categoria-produto.model';

export interface ICategoriaProdutoService extends IService<CategoriaProduto> {
   findAll(): Promise<CategoriaProduto[]>;
}
