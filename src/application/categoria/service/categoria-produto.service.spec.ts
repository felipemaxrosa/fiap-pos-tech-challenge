import { Test, TestingModule } from '@nestjs/testing';
import { CategoriaProdutoService } from 'src/application/categoria/service/categoria-produto.service';
import { ICategoriaProdutoService } from 'src/application/categoria/service/categoria-produto.service.interface';
import { CategoriaProduto } from 'src/enterprise/categoria/model/categoria-produto.model';
import { ServiceException } from 'src/enterprise/exception/service.exception';
import { IRepository } from 'src/enterprise/repository/repository';
import { IService } from 'src/enterprise/service/service';
import { RepositoryException } from 'src/infrastructure/exception/repository.exception';
import { CategoriaProdutoConstants } from 'src/shared/constants';


describe('CategoriaProdutoService', () => {
   let service: ICategoriaProdutoService;
   let repository: IRepository<CategoriaProduto>;

   const categoriaProdutos: Array<CategoriaProduto> = [
      { id: 1, nome: 'Lanche' },
      { id: 2, nome: 'Acompanhamento' },
      { id: 3, nome: 'Bebida' },
      { id: 4, nome: 'Sobremesa' },
   ];

   beforeEach(async () => {
      // Configuração do módulo de teste
      const module: TestingModule = await Test.createTestingModule({
         providers: [
            //  IService<CategoriaProduto> provider
            {
               provide: CategoriaProdutoConstants.ISERVICE,
               inject: [CategoriaProdutoConstants.IREPOSITORY],
               useFactory: (repository: IRepository<CategoriaProduto>): IService<CategoriaProduto> => {
                  return new CategoriaProdutoService(repository);
               },
            },
            // Mock do serviço IRepository<CategoriaProduto>
            {
               provide: CategoriaProdutoConstants.IREPOSITORY,
               useValue: {
                  // mock para a chamada repository.find()
                  findAll: jest.fn(() => {
                     return Promise.resolve(categoriaProdutos);
                  }),
               },
            },
         ],
      }).compile();

      // Desabilita a saída de log
      module.useLogger(false);

      // Obtém a instância do repositório, validators e serviço a partir do módulo de teste
      repository = module.get<IRepository<CategoriaProduto>>(CategoriaProdutoConstants.IREPOSITORY);
      service = module.get<ICategoriaProdutoService>(CategoriaProdutoConstants.ISERVICE);
   });

   describe('injeção de dependências', () => {
      it('deve existir instâncias de repositório definida', async () => {
         expect(repository).toBeDefined();
      });
   });

   describe('save', () => {
      it('save deve falhar porque não foi implementado', async () => {
         await expect(service.save(new CategoriaProduto(1, 'empty'))).rejects.toThrow(
            new Error('Método não implementado.'),
         );
      });
   }); // end describe save

   describe('edit', () => {
      it('edit deve falhar porque não foi implementado', async () => {
         await expect(service.edit(new CategoriaProduto(1, 'empty'))).rejects.toThrow(
            new Error('Método não implementado.'),
         );
      });
   }); // end describe edit

   describe('delete', () => {
      it('delete deve falhar porque não foi implementado', async () => {
         await expect(service.delete(1)).rejects.toThrow(new Error('Método não implementado.'));
      });
   }); // end describe delete

   describe('findById', () => {
      it('findById deve falhar porque não foi implementado', async () => {
         await expect(service.findById(1)).rejects.toThrow(new Error('Método não implementado.'));
      });
   }); // end describe findById

   describe('findAll', () => {
      it('findAll deve retornar uma lista de categorias de produtos', async () => {
         const result = await service.findAll();
         expect(result).toEqual(categoriaProdutos);
      });
      it('não deve buscar lista de categorias de produto quando houver um erro de banco ', async () => {
         const error = new RepositoryException('Erro genérico de banco de dados');
         jest.spyOn(repository, 'findAll').mockRejectedValue(error);

         // verifica se foi lançada uma exception na camada de serviço
         await expect(service.findAll()).rejects.toThrowError(ServiceException);
      }); // end it não deve buscar lista de categorias de produto quando houver um erro de banco
   }); // end describe findAll
});
