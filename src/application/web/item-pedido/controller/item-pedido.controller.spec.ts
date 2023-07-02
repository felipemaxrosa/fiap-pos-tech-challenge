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

   beforeEach(async () => {
      // Configuração do módulo de teste
      const module: TestingModule = await Test.createTestingModule({
         controllers: [ItemPedidoController],
         providers: [
            // Mock do serviço IService<ItemPedido>
            {
               provide: ItemPedidoConstants.ISERVICE,
               useValue: {
                  save: jest.fn((request) =>
                     request ? Promise.resolve(itemPedido) : Promise.reject(new Error('error')),
                  ),
                  findById: jest.fn((id) =>
                     id === itemPedido.id ? Promise.resolve(itemPedido) : Promise.resolve(undefined),
                  ),
               },
            },
         ],
      }).compile();

      // Desabilita a saída de log
      module.useLogger(false);

      // Obtém a instância do controller e do serviço a partir do módulo de teste
      controller = module.get<ItemPedidoController>(ItemPedidoController);
      service = module.get<IService<ItemPedido>>(ItemPedidoConstants.ISERVICE);
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

   it('não deve tratar erro a nível de controlador', async () => {
      const error = new Error('Erro genérico não tratado');
      jest.spyOn(service, 'save').mockRejectedValue(error);

      // Chama o método salvar do controller
      await expect(controller.salvar(novoItem)).rejects.toThrow('Erro genérico não tratado');

      // Verifica se método save foi chamado com o parametro esperado
      expect(service.save).toHaveBeenCalledWith(novoItem);
   });
});
