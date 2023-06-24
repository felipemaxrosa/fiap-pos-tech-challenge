import { Test, TestingModule } from '@nestjs/testing';
import { ProdutoController } from './produto.controller';
import { Produto } from 'src/domain/produto/model/produto.model';
import { IService } from 'src/domain/service/service';
import { SalvarProdutoRequest } from '../request/salvar-produto.request';
import { EditarProdutoRequest } from '../request/editar-produto.request';

describe('ProdutoController', () => {
   let controller: ProdutoController;
   let service: IService<Produto>;

   // Define um objeto de requisição para salvar
   const salvarProdutoRequest: SalvarProdutoRequest = {
      nome: 'Teste',
      idCategoriaProduto: 1,
      descricao: 'Teste',
      preco: 10,
      imagemBase64: '',
      ativo: true,
   };

   // Define um objeto de produto esperado como resultado de salvar
   const produtoSalvar: Produto = {
      id: 1,
      nome: salvarProdutoRequest.nome,
      idCategoriaProduto: 1,
      descricao: salvarProdutoRequest.descricao,
      preco: salvarProdutoRequest.preco,
      imagemBase64: '',
      ativo: true,
   };

   // Define um objeto de requisição para salvar
   const editarProdutoRequest: EditarProdutoRequest = {
      id: 1,
      nome: 'Teste 2',
      idCategoriaProduto: 2,
      descricao: 'Teste 2',
      preco: 100,
      imagemBase64: '',
      ativo: true,
   };

   // Define um objeto de produto esperado como resultado de salvar
   const produtoEditar: Produto = {
      id: editarProdutoRequest.id,
      nome: editarProdutoRequest.nome,
      idCategoriaProduto: editarProdutoRequest.idCategoriaProduto,
      descricao: editarProdutoRequest.descricao,
      preco: editarProdutoRequest.preco,
      imagemBase64: editarProdutoRequest.imagemBase64,
      ativo: editarProdutoRequest.ativo,
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
                  save: jest.fn((salvarProdutoRequest) =>
                     salvarProdutoRequest ? Promise.resolve(produtoSalvar) : Promise.reject(new Error('error')),
                  ),
                  edit: jest.fn((editarProdutoRequest) =>
                     editarProdutoRequest ? Promise.resolve(produtoEditar) : Promise.reject(new Error('error')),
                  ),
                  delete: jest.fn((id) => (id ? Promise.resolve(true) : Promise.reject(new Error('error')))),
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
         const result = await controller.save(salvarProdutoRequest);

         // Verifica se o método save do serviço foi chamado corretamente com a requisição
         expect(service.save).toHaveBeenCalledWith(salvarProdutoRequest);

         // Verifica se o resultado obtido é igual ao objeto produto esperado
         expect(result).toEqual(produtoSalvar);
      });

      it('não deve tratar erro a nível de controlador', async () => {
         const error = new Error('Erro genérico não tratado');
         jest.spyOn(service, 'save').mockRejectedValue(error);

         // Chama o método salvar do controller
         await expect(controller.save(salvarProdutoRequest)).rejects.toThrow('Erro genérico não tratado');

         // Verifica se método save foi chamado com o parametro esperado
         expect(service.save).toHaveBeenCalledWith(salvarProdutoRequest);
      });
   });

   describe('editar', () => {
      it('deve editar um produto existente', async () => {
         // Chama o método editar do controller
         const result = await controller.edit(editarProdutoRequest.id, editarProdutoRequest);

         // Verifica se o método edit do serviço foi chamado corretamente com a requisição
         expect(service.edit).toHaveBeenCalledWith(editarProdutoRequest);

         // Verifica se o resultado obtido é igual ao objeto produto esperado
         expect(result).toEqual(produtoEditar);
      }); // end it deve editar um produto existente

      it('não deve tratar erro a nível de controlador', async () => {
         const error = new Error('Erro genérico não tratado');
         jest.spyOn(service, 'edit').mockRejectedValue(error);

         // Chama o método editar do controller
         await expect(controller.edit(editarProdutoRequest.id, editarProdutoRequest)).rejects.toThrow(
            'Erro genérico não tratado',
         );

         // Verifica se método edit foi chamado com os parâmetros esperados
         expect(service.edit).toHaveBeenCalledWith(editarProdutoRequest);
      }); // end it não deve tratar erro a nível de controlador
   }); // end describe editar

   describe('deletar', () => {
      it('deve deletar um produto existente', async () => {
         // Chama o método delete do controller
         const result = await controller.delete(1);

         // Verifica se o método delete do serviço foi chamado corretamente com a requisição
         expect(service.delete).toHaveBeenCalledWith(1);

         // Verifica se o resultado obtido é igual ao objeto produto esperado
         expect(result).toEqual(true);
      }); // end it deve deletar um produto existente

      it('não deve tratar erro a nível de controlador', async () => {
         const error = new Error('Erro genérico não tratado');
         jest.spyOn(service, 'delete').mockRejectedValue(error);

         // Chama o método delete do controller
         await expect(controller.delete(1)).rejects.toThrow('Erro genérico não tratado');

         // Verifica se método delete foi chamado com os parâmetros esperados
         expect(service.delete).toHaveBeenCalledWith(1);
      }); // end it não deve tratar erro a nível de controlador
   }); // end describe deletar
});
