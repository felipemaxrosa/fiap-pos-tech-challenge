import { Test, TestingModule } from '@nestjs/testing';
import { BuscarTodasCategoriasUseCase } from './buscar-todas-categorias.usecase';
import { IRepository } from 'src/enterprise/repository/repository';
import { CategoriaProduto } from 'src/enterprise/categoria/model/categoria-produto.model';
import { ServiceException } from 'src/enterprise/exception/service.exception';
import { CategoriaProdutoConstants } from 'src/shared/constants';
import { PersistenceInMemoryProviders } from 'src/infrastructure/persistence/providers/persistence-in-memory.providers';
import { CategoriaProdutosProviders } from 'src/application/categoria/providers/categoria.providers';

describe('BuscarTodasCategoriasUseCase', () => {
   let useCase: BuscarTodasCategoriasUseCase;
   let repository: IRepository<CategoriaProduto>;

   const categoriasMock: CategoriaProduto[] = [
      { id: 1, nome: 'Lanche' },
      { id: 2, nome: 'Acompanhamento' },
      { id: 3, nome: 'Bebida' },
   ];

   beforeEach(async () => {
      // Configuração do módulo de teste
      const module: TestingModule = await Test.createTestingModule({
         providers: [...CategoriaProdutosProviders, ...PersistenceInMemoryProviders],
      }).compile();

      // Desabilita a saída de log
      module.useLogger(false);

      useCase = module.get<BuscarTodasCategoriasUseCase>(CategoriaProdutoConstants.BUSCAR_TODAS_CATEGORIAS_USECASE);
      repository = module.get<IRepository<CategoriaProduto>>(CategoriaProdutoConstants.IREPOSITORY);
   });

   describe('injeção de dependências', () => {
      it('deve existir instâncias de repositório definida', async () => {
         expect(repository).toBeDefined();
      });
   });

   describe('buscarTodasCategorias', () => {
      it('deve buscar todas as categorias com sucesso', async () => {
         jest.spyOn(repository, 'findAll').mockResolvedValue(categoriasMock);

         const result = await useCase.buscarTodasCategorias();

         expect(result).toEqual(categoriasMock);
      });

      it('deve lançar uma ServiceException em caso de erro no repositório', async () => {
         const error = new Error('Erro no repositório');
         jest.spyOn(repository, 'findAll').mockRejectedValue(error);

         await expect(useCase.buscarTodasCategorias()).rejects.toThrowError(ServiceException);
      });
   });
});
