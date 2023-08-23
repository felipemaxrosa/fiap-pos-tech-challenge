import { Test, TestingModule } from '@nestjs/testing';
import { ICategoriaProdutoService } from 'src/application/categoria/service/categoria-produto.service.interface';
import { CategoriaProduto } from 'src/enterprise/categoria/model/categoria-produto.model';
import { CategoriaProdutoRestApi } from 'src/presentation/rest/categoria/api/categoria-produto.api';
import { CategoriaProdutoConstants } from 'src/shared/constants';

describe('CategoriaProdutoRestApi', () => {
   let restApi: CategoriaProdutoRestApi;
   let service: ICategoriaProdutoService;

   const categoriaProdutos: Array<CategoriaProduto> = [
      { id: 1, nome: 'Lanche' },
      { id: 2, nome: 'Acompanhamento' },
      { id: 3, nome: 'Bebida' },
      { id: 4, nome: 'Sobremesa' },
   ];

   beforeEach(async () => {
      // Configuração do módulo de teste
      const module: TestingModule = await Test.createTestingModule({
         controllers: [CategoriaProdutoRestApi],
         providers: [
            // Mock do serviço IService<CategoriaProduto>
            {
               provide: CategoriaProdutoConstants.ISERVICE,
               useValue: {
                  // Mocka chamada para findAll
                  findAll: jest.fn(() => Promise.resolve(categoriaProdutos)),
               },
            },
         ],
      }).compile();

      // Desabilita a saída de log
      module.useLogger(false);

      // Obtém a instância do restApi e do serviço a partir do módulo de teste
      restApi = module.get<CategoriaProdutoRestApi>(CategoriaProdutoRestApi);
      service = module.get<ICategoriaProdutoService>(CategoriaProdutoConstants.ISERVICE);
   });

   describe('listar todas as categorias de produto', () => {
      it('deve listar todas as categorias de produto', async () => {
         // Chama o método findAll do restApi
         const result = await restApi.findAll();

         // Verifica se o método findAll do serviço foi chamado corretamente com a requisição
         expect(service.findAll).toHaveBeenCalledWith();

         // Verifica se o resultado obtido é igual ao objeto produto esperado
         expect(result).toEqual(categoriaProdutos);
      }); // end it deve buscar por idCategoriaProduto

      it('não deve tratar erro a nível de controlador', async () => {
         const error = new Error('Erro genérico não tratado');
         jest.spyOn(service, 'findAll').mockRejectedValue(error);

         // Chama o método findAll do restApi
         await expect(restApi.findAll()).rejects.toThrow('Erro genérico não tratado');

         // Verifica se método findAll foi chamado com os parâmetros esperados
         expect(service.findAll).toHaveBeenCalledWith();
      }); // end it não deve tratar erro a nível de controlador
   }); // end describe buscar por idCategoriaProduto
});
