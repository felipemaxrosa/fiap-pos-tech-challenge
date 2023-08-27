import { Test, TestingModule } from '@nestjs/testing';
import { DeletarProdutoUseCase } from './deletar-produto.usecase';
import { ServiceException } from 'src/enterprise/exception/service.exception';
import { IRepository } from 'src/enterprise/repository/repository';
import { Produto } from 'src/enterprise/produto/model/produto.model';
import { ProdutoConstants } from 'src/shared/constants';
import { ProdutoProviders } from 'src/application/produto/providers/produto.providers';
import { PersistenceInMemoryProviders } from 'src/infrastructure/persistence/providers/persistence-in-memory.providers';

describe('DeletarProdutoUseCase', () => {
   let useCase: DeletarProdutoUseCase;
   let repository: IRepository<Produto>;

   const produtoId = 1;

   beforeEach(async () => {
      const module: TestingModule = await Test.createTestingModule({
         providers: [...ProdutoProviders, ...PersistenceInMemoryProviders],
      }).compile();

      // Desabilita a saída de log
      module.useLogger(false);

      useCase = module.get<DeletarProdutoUseCase>(ProdutoConstants.DELETAR_PRODUTO_USECASE);
      repository = module.get<IRepository<Produto>>(ProdutoConstants.IREPOSITORY);
   });

   describe('deletarProduto', () => {
      it('deve deletar um produto com sucesso', async () => {
         jest.spyOn(repository, 'delete').mockResolvedValue(true);

         const result = await useCase.deletarProduto(produtoId);

         expect(result).toBe(true);
      });

      it('deve lançar uma ServiceException em caso de erro ao deletar produto', async () => {
         const error = new Error('Erro ao deletar produto');
         jest.spyOn(repository, 'delete').mockRejectedValue(error);

         await expect(useCase.deletarProduto(produtoId)).rejects.toThrowError(ServiceException);
      });
   });
});
