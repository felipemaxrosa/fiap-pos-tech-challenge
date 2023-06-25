import { Test, TestingModule } from '@nestjs/testing';

import { Pedido } from 'src/domain/pedido/model/pedido.model';
import { PedidoController } from './pedido.controller';
import { IService } from 'src/domain/service/service';
import { CriarNovoPedidoRequest } from '../request/criar-novo-pedido.request';
import { EstadoPedido } from 'src/domain/pedido/enums/pedido';
import { PedidoConstants } from 'src/shared/constants';

describe('PedidoController', () => {
   let controller: PedidoController;
   let service: IService<Pedido>;

   const novoPedido: CriarNovoPedidoRequest = {
      clienteId: 1,
      dataInicio: '2023-06-18',
      estadoPedido: EstadoPedido.RECEBIDO,
      ativo: true,
   };

   const pedido: Pedido = {
      id: 1,
      clienteId: 1,
      dataInicio: '2023-06-18',
      estadoPedido: EstadoPedido.RECEBIDO,
      ativo: true,
   };

   beforeEach(async () => {
      // Configuração do módulo de teste
      const module: TestingModule = await Test.createTestingModule({
         controllers: [PedidoController],
         providers: [
            // Mock do serviço IService<Pedido>
            {
               provide: PedidoConstants.ISERVICE,
               useValue: {
                  // Mocka chamada para o save, rejeitando a promise em caso de request undefined
                  save: jest.fn((request) => (request ? Promise.resolve(pedido) : Promise.reject(new Error('error')))),
               },
            },
         ],
      }).compile();

      // Desabilita a saída de log
      module.useLogger(false);

      // Obtém a instância do controller e do serviço a partir do módulo de teste
      controller = module.get<PedidoController>(PedidoController);
      service = module.get<IService<Pedido>>(PedidoConstants.ISERVICE);
   });

   describe('injeção de dependências', () => {
      it('deve existir instância de serviço definida', async () => {
         // Verifica se a instância de serviço está definida
         expect(service).toBeDefined();
      });
   });

   describe('salvar', () => {
      it('deve contar um estado do pedido RECEBIDO', () => {
         expect(novoPedido.estadoPedido).toEqual(EstadoPedido.RECEBIDO);
      });

      it('deve CRIAR um novo pedido', async () => {
         // Chama o método salvar do controller
         const result = await controller.salvar(novoPedido);

         // Verifica se o método save do serviço foi chamado corretamente com a requisição
         expect(service.save).toHaveBeenCalledWith(novoPedido);

         // Verifica se o resultado obtido é igual ao objeto cliente esperado
         expect(result).toEqual(pedido);
      });

      it('não deve tratar erro a nível de controlador', async () => {
         const error = new Error('Erro genérico não tratado');
         jest.spyOn(service, 'save').mockRejectedValue(error);

         // Chama o método salvar do controller
         await expect(controller.salvar(novoPedido)).rejects.toThrow('Erro genérico não tratado');

         // Verifica se método save foi chamado com o parametro esperado
         expect(service.save).toHaveBeenCalledWith(novoPedido);
      });
   });
});
