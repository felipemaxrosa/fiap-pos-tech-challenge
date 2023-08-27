import { Test, TestingModule } from '@nestjs/testing';
import { BuscarProdutoPorIdUseCase } from './buscar-produto-por-id.usecase';
import { ServiceException } from 'src/enterprise/exception/service.exception';
import { IRepository } from 'src/enterprise/repository/repository';
import { Produto } from 'src/enterprise/produto/model/produto.model';
import { ProdutoConstants } from 'src/shared/constants';
import { ProdutoProviders } from 'src/application/produto/providers/produto.providers';
import { PersistenceInMemoryProviders } from 'src/infrastructure/persistence/providers/persistence-in-memory.providers';

describe('BuscarProdutoPorIdUseCase', () => {
   let useCase: BuscarProdutoPorIdUseCase;
   let repository: IRepository<Produto>;

   const produtoId = 1;
   const produtoMock: Produto = new Produto(
      'Produto Teste',
      1,
      'Descrição do Produto Teste',
      10.0,
      'Imagem em base64',
      true,
      produtoId,
   );

   beforeEach(async () => {
      const module: TestingModule = await Test.createTestingModule({
         providers: [...ProdutoProviders, ...PersistenceInMemoryProviders],
      }).compile();

      // Desabilita a saída de log
      module.useLogger(false);

      useCase = module.get<BuscarProdutoPorIdUseCase>(ProdutoConstants.BUSCAR_PRODUTO_POR_ID_USECASE);
      repository = module.get<IRepository<Produto>>(ProdutoConstants.IREPOSITORY);
   });

   describe('buscarProdutoPorID', () => {
      it('deve buscar um produto por ID com sucesso', async () => {
         jest.spyOn(repository, 'findBy').mockResolvedValue([produtoMock]);

         const result = await useCase.buscarProdutoPorID(produtoId);

         expect(result).toEqual(produtoMock);
      });

      it('deve lançar uma ServiceException em caso de erro ao buscar produto', async () => {
         const error = new Error('Erro ao buscar produto');
         jest.spyOn(repository, 'findBy').mockRejectedValue(error);

         await expect(useCase.buscarProdutoPorID(produtoId)).rejects.toThrowError(ServiceException);
      });

      it('deve retornar undefined se nenhum produto for encontrado', async () => {
         jest.spyOn(repository, 'findBy').mockResolvedValue([]);

         const result = await useCase.buscarProdutoPorID(produtoId);

         expect(result).toBeUndefined();
      });
   });
});
