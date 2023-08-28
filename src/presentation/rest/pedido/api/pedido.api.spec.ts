import { Test, TestingModule } from '@nestjs/testing';
import { IPedidoService } from 'src/application/pedido/service/pedido.service.interface';
import { EstadoPedido } from 'src/enterprise/pedido/enums/pedido';
import { Pedido } from 'src/enterprise/pedido/model/pedido.model';
import { PedidoRestApi } from 'src/presentation/rest/pedido/api/pedido.api';
import { ListarPedidoNaoFinalizadoResponse } from 'src/presentation/rest/pedido/response/listar-pedido-nao-finalizado-response';
import { PedidoConstants } from 'src/shared/constants';

describe('PedidoRestApi', () => {
   let restApi: PedidoRestApi;
   let service: IPedidoService;

   const pedido = {
      clienteId: 1,
      dataInicio: '2020-01-01',
      estadoPedido: EstadoPedido.EM_PREPARACAO,
      ativo: true,
      id: 1,
   };

   const salvarPedidoRequest = {
      clienteId: 1,
      dataInicio: '2023-06-18',
      estadoPedido: EstadoPedido.RECEBIDO,
      ativo: true,
   };

   const salvarPedidoResponse = {
      id: 1,
      clienteId: 1,
      dataInicio: '2023-06-18',
      estadoPedido: EstadoPedido.RECEBIDO,
      ativo: true,
   };

   const checkoutPedidoResponse = {
      id: 100,
      clienteId: 1,
      dataInicio: '2023-06-18',
      estadoPedido: EstadoPedido.PAGAMENTO_PENDENTE,
      ativo: true,
      total: 27,
   };

   const itemPedidoCheckout = {
      id: 1,
      pedidoId: 100,
      produtoId: 1,
      quantidade: 1,
   };

   const produtoItemPedidoCheckout = {
      id: 1,
      nome: 'Produto 1',
      descricao: 'Produto 1',
      preco: 27,
      ativo: true,
   };

   const pedidoAntesCheckout: Pedido = {
      clienteId: 1,
      dataInicio: '2023-06-18',
      estadoPedido: EstadoPedido.PAGAMENTO_PENDENTE,
      ativo: true,
      id: 100,
      total: 27,
   };
   const pedidoDepoisCheckout = {
      clienteId: 1,
      dataInicio: '2023-06-18',
      estadoPedido: EstadoPedido.PAGAMENTO_PENDENTE,
      ativo: true,
      id: 100,
      total: 27,
   };

   beforeEach(async () => {
      // Configuração do módulo de teste
      const module: TestingModule = await Test.createTestingModule({
         controllers: [PedidoRestApi],
         providers: [
            // Mock do serviço IService<Pedido>
            {
               provide: PedidoConstants.ISERVICE,
               useValue: {
                  save: jest.fn((request) =>
                     request ? Promise.resolve(salvarPedidoResponse) : Promise.reject(new Error('error')),
                  ),
                  findById: jest.fn((id) =>
                     id === salvarPedidoResponse.id
                        ? Promise.resolve(salvarPedidoResponse)
                        : id === pedidoAntesCheckout.id
                        ? Promise.resolve(pedidoAntesCheckout)
                        : Promise.resolve(undefined),
                  ),
                  findAllByEstadoDoPedido: jest.fn((estado) =>
                     Promise.resolve([salvarPedidoResponse].filter((pedido) => pedido.estadoPedido === estado)),
                  ),
                  listarPedidosPendentes: jest.fn(() => Promise.resolve([pedido])),
                  listarPedidosNaoFinalizados: jest.fn(() => Promise.resolve([pedido])),
                  checkout: jest.fn((pedido) =>
                     pedido.id === checkoutPedidoResponse.id
                        ? Promise.resolve(checkoutPedidoResponse)
                        : Promise.reject(new Error('error')),
                  ),
               },
            },
         ],
      }).compile();

      // Desabilita a saída de log
      module.useLogger(false);

      // Obtém a instância do restApi e do serviço a partir do módulo de teste
      restApi = module.get<PedidoRestApi>(PedidoRestApi);
      service = module.get<IPedidoService>(PedidoConstants.ISERVICE);
   });

   describe('injeção de dependências', () => {
      it('deve existir instância de serviço definida', async () => {
         // Verifica se a instância de serviço está definida
         expect(service).toBeDefined();
      });
   });

   describe('salvar', () => {
      it('deve contar um estado do pedido RECEBIDO', () => {
         expect(salvarPedidoRequest.estadoPedido).toEqual(EstadoPedido.RECEBIDO);
      });

      it('deve CRIAR um novo pedido', async () => {
         // Chama o método salvar do restApi
         const result = await restApi.salvar(salvarPedidoRequest);

         // Verifica se o método save do serviço foi chamado corretamente com a requisição
         expect(service.save).toHaveBeenCalledWith(salvarPedidoRequest);

         // Verifica se o resultado obtido é igual ao objeto cliente esperado
         expect(result).toEqual(salvarPedidoResponse);
      });

      it('não deve tratar erro a nível de controlador', async () => {
         const error = new Error('Erro genérico não tratado');
         jest.spyOn(service, 'save').mockRejectedValue(error);

         // Chama o método salvar do restApi
         await expect(restApi.salvar(salvarPedidoRequest)).rejects.toThrow('Erro genérico não tratado');

         // Verifica se método save foi chamado com o parametro esperado
         expect(service.save).toHaveBeenCalledWith(salvarPedidoRequest);
      });
   });

   describe('buscaPorId', () => {
      it('deve buscar o pedido por ID', async () => {
         const result = await restApi.findById(1);

         expect(service.findById).toHaveBeenCalledWith(salvarPedidoResponse.id);
         expect(result).toEqual(salvarPedidoResponse);
      });

      it('não deve encontrar o pedido', async () => {
         await restApi.findById(2).catch((error) => {
            expect(error.message).toEqual('Pedido não encontrado');
            expect(error.status).toEqual(404);
         });
      });
   });

   describe('buscaEstadoDoPedido', () => {
      it('deve buscar estado do pedido', async () => {
         const result = await restApi.findByIdEstadoDoPedido(salvarPedidoResponse.id);

         expect(result).toEqual({ estadoPedido: salvarPedidoResponse.estadoPedido });
      });

      it('não deve encontrar o pedido', async () => {
         await restApi.findByIdEstadoDoPedido(2).catch((error) => {
            expect(error.message).toEqual(`Pedido não encontrado: ${2}`);
            expect(error.status).toEqual(404);
         });
      });
   });

   describe('listarPendentes', () => {
      it('deve listar pedidos pendentes', async () => {
         const result = await restApi.listarPendentes();

         expect(result).toEqual([pedido]);
      });

      it('não deve encontrar o pedido', async () => {
         await restApi.findByIdEstadoDoPedido(2).catch((error) => {
            expect(error.message).toEqual(`Pedido não encontrado: ${2}`);
            expect(error.status).toEqual(404);
         });
      });
   });

   describe('buscaPedidosPorEstado', () => {
      const mockedPedidos = [salvarPedidoResponse];
      it('deve buscar pedidos com estado: RECEBIDO (1)', async () => {
         const result = await restApi.findAllByEstadoDoPedido(EstadoPedido.RECEBIDO);

         expect(result).toEqual(mockedPedidos);
      });

      it('nao deve buscar pedidos com estado: EM PREPARO (2)', async () => {
         await restApi.findAllByEstadoDoPedido(EstadoPedido.EM_PREPARACAO).catch((error) => {
            expect(error.message).toEqual(`Pedidos com estado: ${EstadoPedido.EM_PREPARACAO} não encontrados`);
            expect(error.status).toEqual(404);
         });
      });

      it('nao deve buscar pedidos com estado: PRONTO (3)', async () => {
         await restApi.findAllByEstadoDoPedido(EstadoPedido.PRONTO).catch((error) => {
            expect(error.message).toEqual(`Pedidos com estado: ${EstadoPedido.PRONTO} não encontrados`);
            expect(error.status).toEqual(404);
         });
      });

      it('nao deve buscar pedidos com estado: FINALIZADO (4)', async () => {
         await restApi.findAllByEstadoDoPedido(EstadoPedido.FINALIZADO).catch((error) => {
            expect(error.message).toEqual(`Pedidos com estado: ${EstadoPedido.FINALIZADO} não encontrados`);
            expect(error.status).toEqual(404);
         });
      });
   });

   describe('listarPedidosNaoFinalizados', () => {
      it('deve listar pedidos não finalizados', async () => {
         // Chama o método listarPedidosNaoFinalizados do restApi
         const result = await restApi.listarPedidosNaoFinalizados();

         // Verifica se o método listarPedidosNaoFinalizados do serviço foi chamado corretamente
         expect(service.listarPedidosNaoFinalizados).toHaveBeenCalled();

         // Verifica se o resultado obtido é um array do tipo ListarPedidoNaoFinalizadoResponse
         expect(result).toBeInstanceOf(Array<Pedido>);
         expect(result[0]).toBeInstanceOf(ListarPedidoNaoFinalizadoResponse);

         // Verifica se o resultado obtido tem as propriedades esperadas
         const pedidoResponse = result[0];
         expect(pedidoResponse.clienteId).toEqual(1);
         expect(pedidoResponse.dataInicio).toEqual('2020-01-01');
         expect(pedidoResponse.estadoPedido).toEqual(EstadoPedido.EM_PREPARACAO);
         expect(pedidoResponse.ativo).toEqual(true);
         expect(pedidoResponse.id).toEqual(1);
      });
   });

   describe('checkout', () => {
      it('deve realizar checkout do pedido', async () => {
         const response = await restApi.checkout(100);

         // Verifica se o resultado obtido tem as propriedades esperadas
         expect(response.clienteId).toEqual(pedidoDepoisCheckout.clienteId);
         expect(response.dataInicio).toEqual(pedidoDepoisCheckout.dataInicio);
         expect(response.estadoPedido).toEqual(pedidoDepoisCheckout.estadoPedido);
         expect(response.ativo).toEqual(pedidoDepoisCheckout.ativo);
         expect(response.id).toEqual(pedidoDepoisCheckout.id);
         expect(response.total).toEqual(pedidoDepoisCheckout.total);
      });

      it('deve falhar se pedido não existir', async () => {
         await restApi.checkout(10000).catch((error) => {
            expect(error.message).toEqual(`Pedido não encontrado: 10000`);
            expect(error.status).toEqual(404);
         });
      });
   });
});
