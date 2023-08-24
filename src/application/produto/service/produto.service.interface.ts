import { Produto } from 'src/enterprise/produto/model/produto.model';
import { IService } from 'src/enterprise/service/service';

export interface IProdutoService extends IService<Produto> {
   save(type: Produto): Promise<Produto>;
   edit(type: Produto): Promise<Produto>;
   delete(id: number): Promise<boolean>;
   findById(id: number): Promise<Produto>;
   findByIdCategoriaProduto(idCategoriaProduto: number): Promise<Produto[]>;
}
