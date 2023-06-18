import { Test, TestingModule } from '@nestjs/testing';
import { ProdutoController } from './produto.controller';
import { Produto } from 'src/domain/produto/model/produto.model';
import { IService } from 'src/domain/service/service';
import { SalvarProdutoRequest } from '../request/salvar-produto.request';

describe('ProdutoController', () => {
   let controller: ProdutoController;
   let service: IService<Produto>;

   // Define um objeto de requisição
   const request: SalvarProdutoRequest = {
      nome: 'Teste',
      idCategoriaProduto: 1,
      descricao: 'Teste',
      preco: 10,
      imagemBase64: '',
      ativo: true,
   };

   // Define um objeto de produto esperado como resultado
   const produto: Produto = {
      id: 1,
      nome: request.nome,
      idCategoriaProduto: 1,
      descricao: request.descricao,
      preco: request.preco,
      imagemBase64: '',
      ativo: true,
   };

   beforeEach(async () => {
      // Configuração do módulo de teste
      const module: TestingModule = await Test.createTestingModule({
         controllers: [ProdutoController],
         providers: [
            // Mock do serviço IService<Produto>
            {
               provide: 'IService<Produto>',
               useValue: {
                  // Mocka chamada para o save, rejeitando a promise em caso de request undefined
                  save: jest.fn((request) => (request ? Promise.resolve(produto) : Promise.reject(new Error('error')))),
               },
            },
         ],
      }).compile();

      // Desabilita a saída de log
      module.useLogger(false);

      // Obtém a instância do controller e do serviço a partir do módulo de teste
      controller = module.get<ProdutoController>(ProdutoController);
      service = module.get<IService<Produto>>('IService<Produto>');
   });

   describe('injeção de dependências', () => {
      it('deve existir instância de serviço definida', async () => {
         // Verifica se a instância de serviço está definida
         expect(service).toBeDefined();
      });
   });

   describe('salvar', () => {
      it('deve salvar um novo produto', async () => {
         // Chama o método salvar do controller
         const result = await controller.salvar(request);

         // Verifica se o método save do serviço foi chamado corretamente com a requisição
         expect(service.save).toHaveBeenCalledWith(request);

         // Verifica se o resultado obtido é igual ao objeto produto esperado
         expect(result).toEqual(produto);
      });

      it('não deve tratar erro a nível de controlador', async () => {
         const error = new Error('Erro genérico não tratado');
         jest.spyOn(service, 'save').mockRejectedValue(error);

         // Chama o método salvar do controller
         await expect(controller.salvar(request)).rejects.toThrow('Erro genérico não tratado');

         // Verifica se método save foi chamado com o parametro esperado
         expect(service.save).toHaveBeenCalledWith(request);
      });
   });
});
