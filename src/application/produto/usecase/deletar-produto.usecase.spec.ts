import { Test, TestingModule } from '@nestjs/testing';
import { ProdutoProviders } from 'src/application/produto/providers/produto.providers';
import { PersistirProdutoValidator } from 'src/application/produto/validation/persistir-produto.validator';
import { ServiceException } from 'src/enterprise/exception/service.exception';
import { ValidationException } from 'src/enterprise/exception/validation.exception';
import { Produto } from 'src/enterprise/produto/model/produto.model';
import { IRepository } from 'src/enterprise/repository/repository';
import { PersistenceInMemoryProviders } from 'src/infrastructure/persistence/providers/persistence-in-memory.providers';
import { ProdutoConstants } from 'src/shared/constants';
import { DeletarProdutoUseCase } from './deletar-produto.usecase';

describe('DeletarProdutoUseCase', () => {
   let useCase: DeletarProdutoUseCase;
   let repository: IRepository<Produto>;
   let validators: PersistirProdutoValidator[];

   const produtoId = 1;

   const produtoStub: Produto = {
      id: 1,
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

      useCase = module.get<DeletarProdutoUseCase>(ProdutoConstants.DELETAR_PRODUTO_USECASE);
      repository = module.get<IRepository<Produto>>(ProdutoConstants.IREPOSITORY);
      validators = module.get<PersistirProdutoValidator[]>(ProdutoConstants.DELETAR_PRODUTO_VALIDATOR);
   });

   describe('deletarProduto', () => {
      it('deve deletar um produto com sucesso', async () => {
         jest.spyOn(repository, 'delete').mockResolvedValue(true);
         repository.findBy = jest.fn().mockResolvedValue([produtoStub]);

         const result = await useCase.deletarProduto(produtoId);

         expect(result).toBe(true);
      });

      it('deve lançar uma ValidationException em caso de produtoId inválido', async () => {
         jest.spyOn(validators[0], 'validate').mockResolvedValue(true);
         repository.findBy = jest.fn().mockResolvedValue([]);

         await expect(useCase.deletarProduto(produtoStub.id)).rejects.toThrowError(ValidationException);
      });

      it('deve lançar uma ServiceException em caso de erro ao deletar produto', async () => {
         const error = new Error('Erro ao deletar produto');
         repository.findBy = jest.fn().mockResolvedValue([produtoStub]);
         jest.spyOn(repository, 'delete').mockRejectedValue(error);

         await expect(useCase.deletarProduto(produtoId)).rejects.toThrowError(ServiceException);
      });
   });
});
