import { Test, TestingModule } from '@nestjs/testing';

import { Pedido } from 'src/domain/pedido/model/pedido.model';
import { PedidoController } from './pedido.controller';
import { CriarNovoPedidoRequest } from '../request/criar-novo-pedido.request';
import { EstadoPedido } from 'src/domain/pedido/enums/pedido';
import { PedidoConstants } from 'src/shared/constants';
import { IPedidoService } from 'src/domain/pedido/service/pedido.service.interface';

describe('PedidoController', () => {
   let controller: PedidoController;
   let service: IPedidoService;

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
                  save: jest.fn((request) => (request ? Promise.resolve(pedido) : Promise.reject(new Error('error')))),
                  findById: jest.fn((id) => (id === pedido.id ? Promise.resolve(pedido) : Promise.resolve(undefined))),
                  findAllByEstadoDoPedido: jest.fn((estado) =>
                     Promise.resolve([pedido].filter((pedido) => pedido.estadoPedido === estado)),
                  ),
               },
            },
         ],
      }).compile();

      // Desabilita a saída de log
      module.useLogger(false);

      // Obtém a instância do controller e do serviço a partir do módulo de teste
      controller = module.get<PedidoController>(PedidoController);
      service = module.get<IPedidoService>(PedidoConstants.ISERVICE);
   });

   describe('injeção de dependências', () => {
      it('deve existir instância de serviço definida', async () => {
         // Verifica se a instância de serviço está definida
         expect(service).toBeDefined();
      });
   });

   describe('salvar', () => {
      it('deve conter um estado do pedido RECEBIDO', () => {
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

   describe('buscaPorId', () => {
      it('deve buscar o pedido por ID', async () => {
         const result = await controller.findById(1);

         expect(service.findById).toHaveBeenCalledWith(pedido.id);
         expect(result).toEqual(pedido);
      });

      it('não deve encontrar o pedido', async () => {
         await controller.findById(2).catch((error) => {
            expect(error.message).toEqual('Pedido não encontrado');
            expect(error.status).toEqual(404);
         });
      });
   });

   describe('buscaEstadoDoPedido', () => {
      it('deve buscar estado do pedido', async () => {
         const result = await controller.findByIdEstadoDoPedido(pedido.id);

         expect(result).toEqual({ estadoPedido: pedido.estadoPedido });
      });

      it('não deve encontrar o pedido', async () => {
         await controller.findByIdEstadoDoPedido(2).catch((error) => {
            expect(error.message).toEqual(`Pedido não encontrado: ${2}`);
            expect(error.status).toEqual(404);
         });
      });
   });

   describe('buscaPedidosPorEstado', () => {
      const mockedPedidos = [pedido];
      it('deve buscar pedidos com estado: RECEBIDO (1)', async () => {
         const result = await controller.findAllByEstadoDoPedido(EstadoPedido.RECEBIDO);

         expect(result).toEqual(mockedPedidos);
      });

      it('nao deve buscar pedidos com estado: EM PREPARO (2)', async () => {
         await controller.findAllByEstadoDoPedido(EstadoPedido.EM_PREPARO).catch((error) => {
            expect(error.message).toEqual(`Pedidos com estado: ${EstadoPedido.EM_PREPARO} não encontrados`);
            expect(error.status).toEqual(404);
         });
      });

      it('nao deve buscar pedidos com estado: PRONTO (3)', async () => {
         await controller.findAllByEstadoDoPedido(EstadoPedido.PRONTO).catch((error) => {
            expect(error.message).toEqual(`Pedidos com estado: ${EstadoPedido.PRONTO} não encontrados`);
            expect(error.status).toEqual(404);
         });
      });

      it('nao deve buscar pedidos com estado: FINALIZADO (4)', async () => {
         await controller.findAllByEstadoDoPedido(EstadoPedido.FINALIZADO).catch((error) => {
            expect(error.message).toEqual(`Pedidos com estado: ${EstadoPedido.FINALIZADO} não encontrados`);
            expect(error.status).toEqual(404);
         });
      });
   });
});
