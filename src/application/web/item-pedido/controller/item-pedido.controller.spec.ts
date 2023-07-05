import { Test, TestingModule } from '@nestjs/testing';

import { ItemPedido } from '../../../../domain/item-pedido/model';
import { ItemPedidoConstants } from '../../../../shared/constants';
import { SalvarItemPedidoRequest } from '../request';
import { ItemPedidoController } from './item-pedido.controller';
import { IService } from 'src/domain/service/service';
import { SalvarItemPedidoResponse } from '../request/salvar-item-pedido.response';

describe('ItemPedidoController', () => {
   let controller: ItemPedidoController;
   let service: IService<ItemPedido>;

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
         controllers: [ItemPedidoController],
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
                  delete: jest.fn((request) => Promise.resolve(true)),
               },
            },
         ],
      }).compile();

      // Desabilita a saída de log
      module.useLogger(false);

      // Obtém a instância do controller e do serviço a partir do módulo de teste
      controller = module.get<ItemPedidoController>(ItemPedidoController);
      service = module.get<IService<ItemPedido>>(ISERVICE);
   });

   describe('injeção de dependências', () => {
      it('deve existir instância de serviço definida', async () => {
         // Verifica se a instância de serviço está definida
         expect(service).toBeDefined();
      });
   });

   describe('salvar', () => {
      it('deve adicionar um item ao pedido', async () => {
         const result = await controller.salvar(novoItem);

         expect(service.save).toHaveBeenCalledWith(novoItem);
         expect(result).toEqual(itemPedido);
      });
   });

   describe('delete', () => {
      it('deve deletar um item ao pedido', async () => {
         const result = await controller.delete(itemPedido.id);

         expect(service.delete).toHaveBeenCalledWith(itemPedido.id);
         expect(result).toBeTruthy();
      });
   });

   describe('editar', () => {
      const { id, ...dadosDeItemParaEdicao } = itemParaEdicao;

      it('deve editar um item ao pedido', async () => {
         const result = await controller.editar(id, dadosDeItemParaEdicao);

         expect(result).toEqual(itemParaEdicao);
      });
   });

   it('não deve tratar erro a nível de controlador', async () => {
      const error = new Error('Erro genérico não tratado');
      jest.spyOn(service, 'save').mockRejectedValue(error);

      // Chama o método salvar do controller
      await expect(controller.salvar(novoItem)).rejects.toThrow('Erro genérico não tratado');

      // Verifica se método save foi chamado com o parametro esperado
      expect(service.save).toHaveBeenCalledWith(novoItem);
   });
});
