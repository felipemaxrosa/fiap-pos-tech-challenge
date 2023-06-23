import { IService } from 'src/domain/service/service';
import { Produto } from '../model/produto.model';

export interface IProdutoService extends IService<Produto> {
   findByIdCategoriaProduto(idCategoriaProduto: number): Promise<Produto[]>;
}
