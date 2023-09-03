import { Test, TestingModule } from '@nestjs/testing';
import { ProdutoProviders } from 'src/application/produto/providers/produto.providers';
import { PersistirProdutoValidator } from 'src/application/produto/validation/persistir-produto.validator';
import { ServiceException } from 'src/enterprise/exception/service.exception';
import { Produto } from 'src/enterprise/produto/model/produto.model';
import { IRepository } from 'src/enterprise/repository/repository';
import { PersistenceInMemoryProviders } from 'src/infrastructure/persistence/providers/persistence-in-memory.providers';
import { ProdutoConstants } from 'src/shared/constants';
import { SalvarProdutoUseCase } from './salvar-produto.usecase';

describe('SalvarProdutoUseCase', () => {
   let useCase: SalvarProdutoUseCase;
   let repository: IRepository<Produto>;
   let validators: PersistirProdutoValidator[];

   const produtoMock: Produto = {
      nome: 'Produto Teste',
      idCategoriaProduto: 1,
      descricao: 'Descrição do Produto Teste',
      preco: 10.0,
      imagemBase64: 'Imagem em base64',
      ativo: true,
   };

   beforeEach(async () => {
      const module: TestingModule = await Test.createTestingModule({
         providers: [...ProdutoProviders, ...PersistenceInMemoryProviders],
      }).compile();

      // Desabilita a saída de log
      module.useLogger(false);

      useCase = module.get<SalvarProdutoUseCase>(ProdutoConstants.SALVAR_PRODUTO_USECASE);
      repository = module.get<IRepository<Produto>>(ProdutoConstants.IREPOSITORY);
      validators = module.get<PersistirProdutoValidator[]>(ProdutoConstants.SALVAR_PRODUTO_VALIDATOR);
   });

   describe('salvarProduto', () => {
      it('deve salvar um produto com sucesso', async () => {
         jest.spyOn(validators[0], 'validate').mockResolvedValue(true);
         jest.spyOn(repository, 'save').mockResolvedValue(produtoMock);

         const result = await useCase.salvarProduto(produtoMock);

         expect(result).toEqual(produtoMock);
      });

      it('deve lançar uma ServiceException em caso de erro ao salvar o produto', async () => {
         jest.spyOn(validators[0], 'validate').mockResolvedValue(true);
         const error = new Error('Erro ao salvar produto');
         jest.spyOn(repository, 'save').mockRejectedValue(error);

         await expect(useCase.salvarProduto(produtoMock)).rejects.toThrowError(ServiceException);
      });
   });
});
