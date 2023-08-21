import { Produto } from 'src/enterprise/produto/model/produto.model';
import { IService } from 'src/enterprise/service/service';

export interface IProdutoService extends IService<Produto> {
   findByIdCategoriaProduto(idCategoriaProduto: number): Promise<Produto[]>;
}
