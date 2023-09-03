import { Test, TestingModule } from '@nestjs/testing';
import { IItemPedidoService } from 'src/application/item-pedido/service/item-pedido.service.interface';
import { ItemPedido } from 'src/enterprise/item-pedido/model';
import { ItemPedidoRestApi } from 'src/presentation/rest/item-pedido/api/item-pedido.api';
import { SalvarItemPedidoRequest, SalvarItemPedidoResponse } from 'src/presentation/rest/item-pedido';
import { ItemPedidoConstants } from 'src/shared/constants';

describe('ItemPedidoRestApi', () => {
   let restApi: ItemPedidoRestApi;
   let service: IItemPedidoService;

   const { ISERVICE } = ItemPedidoConstants;

   const novoItem: SalvarItemPedidoRequest = {
      pedidoId: 1,
      produtoId: 1,
      quantidade: 1,
   };

   const itemPedido: SalvarItemPedidoResponse = {
      id: 1,
      pedidoId: 1,
      produtoId: 1,
      quantidade: 1,
   };

   const itemParaEdicao: ItemPedido = {
      ...itemPedido,
      quantidade: 10,
   };

   beforeEach(async () => {
      // Configuração do módulo de teste
      const module: TestingModule = await Test.createTestingModule({
         controllers: [ItemPedidoRestApi],
         providers: [
            // Mock do serviço IService<ItemPedido>
            {
               provide: ISERVICE,
               useValue: {
                  save: jest.fn((request) =>
                     request ? Promise.resolve(itemPedido) : Promise.reject(new Error('error')),
                  ),
                  edit: jest.fn((request) => (request ? Promise.resolve(itemParaEdicao) : Promise.resolve(undefined))),
                  findById: jest.fn((id) =>
                     id === itemPedido.id ? Promise.resolve(itemPedido) : Promise.resolve(undefined),
                  ),
                  delete: jest.fn(() => Promise.resolve(true)),
               },
            },
         ],
      }).compile();

      // Desabilita a saída de log
      module.useLogger(false);

      // Obtém a instância do restApi e do serviço a partir do módulo de teste
      restApi = module.get<ItemPedidoRestApi>(ItemPedidoRestApi);
      service = module.get<IItemPedidoService>(ISERVICE);
   });

   describe('injeção de dependências', () => {
      it('deve existir instância de serviço definida', async () => {
         // Verifica se a instância de serviço está definida
         expect(service).toBeDefined();
      });
   });

   describe('salvar', () => {
      it('deve adicionar um item ao pedido', async () => {
         const result = await restApi.salvar(novoItem);

         expect(service.save).toHaveBeenCalledWith(novoItem);
         expect(result).toEqual(itemPedido);
      });
   });

   describe('delete', () => {
      it('deve deletar um item ao pedido', async () => {
         const result = await restApi.delete(itemPedido.id);

         expect(service.delete).toHaveBeenCalledWith(itemPedido.id);
         expect(result).toBeTruthy();
      });
   });

   describe('editar', () => {
      const { id, ...dadosDeItemParaEdicao } = itemParaEdicao;

      it('deve editar um item ao pedido', async () => {
         const result = await restApi.editar(id, dadosDeItemParaEdicao);

         expect(result).toEqual(itemParaEdicao);
      });
   });

   it('não deve tratar erro a nível de controlador', async () => {
      const error = new Error('Erro genérico não tratado');
      jest.spyOn(service, 'save').mockRejectedValue(error);

      // Chama o método salvar do restApi
      await expect(restApi.salvar(novoItem)).rejects.toThrow('Erro genérico não tratado');

      // Verifica se método save foi chamado com o parametro esperado
      expect(service.save).toHaveBeenCalledWith(novoItem);
   });
});
