import { Inject, Injectable } from '@nestjs/common';
import { IProdutoService } from 'src/application/produto/service/produto.service.interface';
import { Produto } from 'src/enterprise/produto/model/produto.model';
import { ProdutoConstants } from 'src/shared/constants';
import { SalvarProdutoUseCase } from 'src/application/produto/usecase/salvar-produto.usecase';
import { EditarProdutoUseCase } from 'src/application/produto/usecase/editar-produto.usecase';
import { DeletarProdutoUseCase } from 'src/application/produto/usecase/deletar-produto.usecase';
import { BuscarProdutoPorIdUseCase } from 'src/application/produto/usecase/buscar-produto-por-id.usecase';
import { BuscarProdutoPorIdCategoriaUseCase } from 'src/application/produto/usecase/buscar-produto-por-id-categoria.usecase';

@Injectable()
export class ProdutoService implements IProdutoService {
   constructor(
      @Inject(ProdutoConstants.SALVAR_PRODUTO_USECASE) private salvarUseCase: SalvarProdutoUseCase,
      @Inject(ProdutoConstants.EDITAR_PRODUTO_USECASE) private editarUseCase: EditarProdutoUseCase,
      @Inject(ProdutoConstants.DELETAR_PRODUTO_USECASE) private deletarUseCase: DeletarProdutoUseCase,
      @Inject(ProdutoConstants.BUSCAR_PRODUTO_POR_ID_USECASE) private buscarPorIdUseCase: BuscarProdutoPorIdUseCase,
      @Inject(ProdutoConstants.BUSCAR_PRODUTO_POR_ID_CATEGORIA_USECASE)
      private buscarPorIdCategoriaUseCase: BuscarProdutoPorIdCategoriaUseCase,
   ) {}

   async save(produto: Produto): Promise<Produto> {
      return await this.salvarUseCase.salvarProduto(produto);
   }

   async edit(produto: Produto): Promise<Produto> {
      return await this.editarUseCase.editarProduto(produto);
   }

   async delete(id: number): Promise<boolean> {
      return await this.deletarUseCase.deletarProduto(id);
   }

   async findById(id: number): Promise<Produto> {
      return await this.buscarPorIdUseCase.buscarProdutoPorID(id);
   }

   async findByIdCategoriaProduto(idCategoriaProduto: number): Promise<Produto[]> {
      return await this.buscarPorIdCategoriaUseCase.buscarProdutoPorIdCategoria(idCategoriaProduto);
   }
}
