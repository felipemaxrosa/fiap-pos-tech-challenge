import { Test, TestingModule } from '@nestjs/testing';

import { ProdutoConstants } from '../../../../shared/constants';
import { Produto } from '../../../../domain/produto/model/produto.model';
import { IProdutoService } from '../../../../domain/produto/service/produto.service.interface';
import { SalvarProdutoRequest } from '../request/salvar-produto.request';
import { EditarProdutoRequest } from '../request/editar-produto.request';
import { SalvarProdutoResponse } from '../response/salvar-produto.response';
import { ProdutoController } from './produto.controller';

describe('ProdutoController', () => {
   let controller: ProdutoController;
   let service: IProdutoService;

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
   const produtoSalvar: SalvarProdutoResponse = {
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
               provide: ProdutoConstants.ISERVICE,
               useValue: {
                  // Mocka chamada para o save, rejeitando a promise em caso de request undefined
                  save: jest.fn((salvarProdutoRequest) =>
                     salvarProdutoRequest ? Promise.resolve(produtoSalvar) : Promise.reject(new Error('error')),
                  ),
                  edit: jest.fn((editarProdutoRequest) =>
                     editarProdutoRequest ? Promise.resolve(produtoEditar) : Promise.reject(new Error('error')),
                  ),
                  delete: jest.fn((id) => (id ? Promise.resolve(true) : Promise.reject(new Error('error')))),
                  findById: jest.fn((id) => (id === 1 ? Promise.resolve(produtoSalvar) : Promise.resolve(undefined))),
                  findByIdCategoriaProduto: jest.fn((id) =>
                     id === 1 ? Promise.resolve([produtoSalvar]) : Promise.resolve(undefined),
                  ),
               },
            },
         ],
      }).compile();

      // Desabilita a saída de log
      module.useLogger(false);

      // Obtém a instância do controller e do serviço a partir do módulo de teste
      controller = module.get<ProdutoController>(ProdutoController);
      service = module.get<IProdutoService>(ProdutoConstants.ISERVICE);
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

   describe('buscar por id', () => {
      it('deve buscar por id um produto existente', async () => {
         // Chama o método findById do controller
         const result = await controller.findById(1);

         // Verifica se o método findById do serviço foi chamado corretamente com a requisição
         expect(service.findById).toHaveBeenCalledWith(1);

         // Verifica se o resultado obtido é igual ao objeto produto esperado
         expect(result).toEqual(produtoSalvar);
      }); // end it deve buscar por id um produto existente

      it('deve retornar NotFoundException se buscar por id um produto inexistente', async () => {
         // Chama o método findById do controller
         await expect(controller.findById(10000)).rejects.toThrow('Produto não encontrado: 10000');
         // Verifica se o método findById do serviço foi chamado corretamente com a requisição
         expect(service.findById).toHaveBeenCalledWith(10000);
      }); // end it deve retornar NotFoundException se buscar por id um produto inexistente

      it('não deve tratar erro a nível de controlador', async () => {
         const error = new Error('Erro genérico não tratado');
         jest.spyOn(service, 'findById').mockRejectedValue(error);

         // Chama o método findById do controller
         await expect(controller.findById(1)).rejects.toThrow('Erro genérico não tratado');

         // Verifica se método findById foi chamado com os parâmetros esperados
         expect(service.findById).toHaveBeenCalledWith(1);
      }); // end it não deve tratar erro a nível de controlador
   }); // end describe buscar por id

   describe('buscar por idCategoriaProduto', () => {
      it('deve buscar por idCategoriaProduto', async () => {
         // Chama o método findById do controller
         const result = await controller.findByIdCategoriaProduto(1);

         // Verifica se o método findById do serviço foi chamado corretamente com a requisição
         expect(service.findByIdCategoriaProduto).toHaveBeenCalledWith(1);

         // Verifica se o resultado obtido é igual ao objeto produto esperado
         expect(result).toEqual([produtoSalvar]);
      }); // end it deve buscar por idCategoriaProduto

      it('deve retornar NotFoundException se não houver produtos na idCategoriaProduto', async () => {
         // Chama o método findByIdCategoriaProduto do controller
         await expect(controller.findByIdCategoriaProduto(3)).rejects.toThrow(
            'Produtos não encontrados para idCategoriaProduto: 3',
         );
         // Verifica se o método findByIdCategoriaProduto do serviço foi chamado corretamente com a requisição
         expect(service.findByIdCategoriaProduto).toHaveBeenCalledWith(3);
      }); // end it deve retornar NotFoundException se não houver produtos na idCategoriaProduto

      it('não deve tratar erro a nível de controlador', async () => {
         const error = new Error('Erro genérico não tratado');
         jest.spyOn(service, 'findByIdCategoriaProduto').mockRejectedValue(error);

         // Chama o método findByIdCategoriaProduto do controller
         await expect(controller.findByIdCategoriaProduto(1)).rejects.toThrow('Erro genérico não tratado');

         // Verifica se método findByIdCategoriaProduto foi chamado com os parâmetros esperados
         expect(service.findByIdCategoriaProduto).toHaveBeenCalledWith(1);
      }); // end it não deve tratar erro a nível de controlador
   }); // end describe buscar por idCategoriaProduto
});
