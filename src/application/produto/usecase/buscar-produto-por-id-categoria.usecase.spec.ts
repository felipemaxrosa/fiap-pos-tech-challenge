import { Test, TestingModule } from '@nestjs/testing';
import { BuscarProdutoPorIdCategoriaUseCase } from './buscar-produto-por-id-categoria.usecase';
import { ServiceException } from 'src/enterprise/exception/service.exception';
import { IRepository } from 'src/enterprise/repository/repository';
import { Produto } from 'src/enterprise/produto/model/produto.model';
import { ProdutoConstants } from 'src/shared/constants';
import { ProdutoProviders } from 'src/application/produto/providers/produto.providers';
import { PersistenceInMemoryProviders } from 'src/infrastructure/persistence/providers/persistence-in-memory.providers';

describe('BuscarProdutoPorIdCategoriaUseCase', () => {
   let useCase: BuscarProdutoPorIdCategoriaUseCase;
   let repository: IRepository<Produto>;

   const idCategoriaProduto = 1;
   const produtosMock: Produto[] = [
      new Produto('Produto 1', idCategoriaProduto, 'Descrição do Produto 1', 10.0, 'Imagem em base64', true, 1),
      new Produto('Produto 2', idCategoriaProduto, 'Descrição do Produto 2', 20.0, 'Imagem em base64', true, 2),
   ];

   beforeEach(async () => {
      const module: TestingModule = await Test.createTestingModule({
         providers: [...ProdutoProviders, ...PersistenceInMemoryProviders],
      }).compile();

      // Desabilita a saída de log
      module.useLogger(false);

      useCase = module.get<BuscarProdutoPorIdCategoriaUseCase>(
         ProdutoConstants.BUSCAR_PRODUTO_POR_ID_CATEGORIA_USECASE,
      );
      repository = module.get<IRepository<Produto>>(ProdutoConstants.IREPOSITORY);
   });

   describe('buscarProdutoPorIdCategoria', () => {
      it('deve buscar produtos por ID de categoria com sucesso', async () => {
         jest.spyOn(repository, 'findBy').mockResolvedValue(produtosMock);

         const result = await useCase.buscarProdutoPorIdCategoria(idCategoriaProduto);

         expect(result).toEqual(produtosMock);
      });

      it('deve lançar uma ServiceException em caso de erro ao buscar produtos', async () => {
         const error = new Error('Erro ao buscar produtos');
         jest.spyOn(repository, 'findBy').mockRejectedValue(error);

         await expect(useCase.buscarProdutoPorIdCategoria(idCategoriaProduto)).rejects.toThrowError(ServiceException);
      });

      it('deve retornar um array vazio se nenhum produto for encontrado', async () => {
         jest.spyOn(repository, 'findBy').mockResolvedValue([]);

         const result = await useCase.buscarProdutoPorIdCategoria(idCategoriaProduto);

         expect(result).toEqual(undefined);
      });
   });
});
