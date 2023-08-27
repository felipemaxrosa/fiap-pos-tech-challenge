import { Test, TestingModule } from '@nestjs/testing';
import { EditarProdutoUseCase } from './editar-produto.usecase';
import { ServiceException } from 'src/enterprise/exception/service.exception';
import { IRepository } from 'src/enterprise/repository/repository';
import { Produto } from 'src/enterprise/produto/model/produto.model';
import { ProdutoConstants } from 'src/shared/constants';
import { ProdutoProviders } from 'src/application/produto/providers/produto.providers';
import { PersistenceInMemoryProviders } from 'src/infrastructure/persistence/providers/persistence-in-memory.providers';
import { SalvarProdutoValidator } from 'src/application/produto/validation/salvar-produto.validator';

describe('EditarProdutoUseCase', () => {
   let useCase: EditarProdutoUseCase;
   let repository: IRepository<Produto>;
   let validators: SalvarProdutoValidator[];

   const produtoMock: Produto = {
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

      useCase = module.get<EditarProdutoUseCase>(ProdutoConstants.EDITAR_PRODUTO_USECASE);
      repository = module.get<IRepository<Produto>>(ProdutoConstants.IREPOSITORY);
      validators = module.get<SalvarProdutoValidator[]>(ProdutoConstants.SALVAR_PRODUTO_VALIDATOR);
   });

   describe('editarProduto', () => {
      it('deve editar um produto com sucesso', async () => {
         jest.spyOn(validators[0], 'validate').mockResolvedValue(true);
         jest.spyOn(repository, 'edit').mockResolvedValue(produtoMock);

         const result = await useCase.editarProduto(produtoMock);

         expect(result).toEqual(produtoMock);
      });

      it('deve lançar uma ServiceException em caso de erro ao editar o produto', async () => {
         jest.spyOn(validators[0], 'validate').mockResolvedValue(true);
         const error = new Error('Erro ao editar produto');
         jest.spyOn(repository, 'edit').mockRejectedValue(error);

         await expect(useCase.editarProduto(produtoMock)).rejects.toThrowError(ServiceException);
      });
   });
});
