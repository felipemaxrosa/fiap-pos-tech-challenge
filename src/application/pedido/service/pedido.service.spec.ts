import { Test, TestingModule } from '@nestjs/testing';
import { PagamentoProviders } from 'src/application/pagamento/providers/pagamento.providers';
import { PedidoProviders } from 'src/application/pedido/providers/pedido.providers';
import { IPedidoService } from 'src/application/pedido/service/pedido.service.interface';
import { EstadoCorretoNovoPedidoValidator } from 'src/application/pedido/validation/estado-correto-novo-pedido.validator';
import { SalvarPedidoValidator } from 'src/application/pedido/validation/salvar-pedido.validator';
import { Cliente } from 'src/enterprise/cliente/model/cliente.model';
import { ServiceException } from 'src/enterprise/exception/service.exception';
import { ItemPedido } from 'src/enterprise/item-pedido/model';
import { EstadoPedido } from 'src/enterprise/pedido/enum/estado-pedido.enum';
import { Pedido } from 'src/enterprise/pedido/model/pedido.model';
import { IPedidoRepository } from 'src/enterprise/pedido/repository/pedido.repository.interface';
import { IRepository } from 'src/enterprise/repository/repository';
import { RepositoryException } from 'src/infrastructure/exception/repository.exception';
import { PersistenceInMemoryProviders } from 'src/infrastructure/persistence/providers/persistence-in-memory.providers';
import { SalvarPedidoRequest } from 'src/presentation/rest/pedido/request';
import { ClienteConstants, ItemPedidoConstants, PedidoConstants } from 'src/shared/constants';
import { DateUtils } from 'src/shared/date.utils';

describe('PedidoService', () => {
   let service: IPedidoService;
   let pedidoRepository: IPedidoRepository;
   let itemPedidoRepository: IRepository<ItemPedido>;
   let validators: SalvarPedidoValidator[];

   const pedido: Pedido = {
      id: 1,
      clienteId: 1,
      dataInicio: DateUtils.toString(new Date()),
      estadoPedido: EstadoPedido.PAGAMENTO_PENDENTE,
      ativo: true,
      total: 10,
   };

   const cliente: Cliente = {
      id: 1,
      nome: 'Teste',
      email: 'teste@teste.com',
      cpf: '25634428777',
   };

   const pedidoPendente: Pedido = {
      id: 2,
      clienteId: 2,
      dataInicio: DateUtils.toString(new Date()),
      estadoPedido: EstadoPedido.EM_PREPARACAO,
      ativo: true,
      total: 10,
   };

   const todosOsPedidos: Pedido[] = [
      {
         id: 3,
         clienteId: 3,
         dataInicio: DateUtils.toString(new Date()),
         estadoPedido: EstadoPedido.RECEBIDO,
         ativo: true,
      },
      {
         id: 4,
         clienteId: 4,
         dataInicio: DateUtils.toString(new Date()),
         estadoPedido: EstadoPedido.PRONTO,
         ativo: true,
      },
      {
         id: 10,
         clienteId: 10,
         dataInicio: DateUtils.toString(new Date()),
         estadoPedido: EstadoPedido.RECEBIDO,
         ativo: true,
      },
      {
         id: 13,
         clienteId: 13,
         dataInicio: DateUtils.toString(new Date()),
         estadoPedido: EstadoPedido.PRONTO,
         ativo: true,
      },
   ];

   const pedidoId = 123;
   const itensPedidoMock: ItemPedido[] = [
      { pedidoId, produtoId: 1, quantidade: 2, id: 1 },
      { pedidoId, produtoId: 2, quantidade: 1, id: 2 },
   ];

   beforeEach(async () => {
      // Configuração do módulo de teste
      const module: TestingModule = await Test.createTestingModule({
         providers: [
            ...PedidoProviders,
            ...PersistenceInMemoryProviders,
            ...PagamentoProviders,
            // Mock do serviço IRepository<Pedido>
            {
               provide: PedidoConstants.IREPOSITORY,
               useValue: {
                  // mock para a chamada repository.save(pedido)
                  save: jest.fn(() => Promise.resolve(pedido)),
                  // mock para a chamada repository.findBy(attributes)
                  findBy: jest.fn(() => {
                     // retorna vazio, simulando que não encontrou registros pelo atributos passados por parâmetro
                     return Promise.resolve({});
                  }),
                  find: jest.fn(() => {
                     return Promise.resolve(todosOsPedidos);
                  }),
                  // findAll: jest.fn(() => Promise.resolve(todosOsPedidos)),
                  // mock para a chamada repository.edit(produto)
                  edit: jest.fn(() => Promise.resolve(pedido)),
                  // mock para a chamada repository.delete(id)
                  delete: jest.fn(() => Promise.resolve(true)),
                  listarPedidosPendentes: jest.fn(() => Promise.resolve([pedidoPendente])),
               },
            },
            // Mock do serviço IRepository<Cliente>
            {
               provide: ClienteConstants.IREPOSITORY,
               useValue: {
                  findBy: jest.fn(() => Promise.resolve([cliente])),
               },
            },
         ],
      }).compile();

      // Desabilita a saída de log
      module.useLogger(false);

      // Obtém a instância do repositório, validators e serviço a partir do módulo de teste
      pedidoRepository = module.get<IPedidoRepository>(PedidoConstants.IREPOSITORY);
      itemPedidoRepository = module.get<IRepository<ItemPedido>>(ItemPedidoConstants.IREPOSITORY);
      validators = module.get<SalvarPedidoValidator[]>(PedidoConstants.SALVAR_PEDIDO_VALIDATOR);
      service = module.get<IPedidoService>(PedidoConstants.ISERVICE);
   });

   describe('injeção de dependências', () => {
      it('deve existir instância de repositório definida', async () => {
         expect(pedidoRepository).toBeDefined();
         expect(itemPedidoRepository).toBeDefined();
         expect(validators).toBeDefined();
      });
   });

   describe('save', () => {
      it('deve CRIAR novo pedido', async () => {
         const novoPedido: SalvarPedidoRequest = {
            clienteId: 1,
            dataInicio: DateUtils.toString(new Date()),
            estadoPedido: EstadoPedido.PAGAMENTO_PENDENTE,
            ativo: true,
         };

         await service.save(novoPedido).then((pedidoSalvo) => {
            // verifica se o pedido criado contém os mesmos dados passados como input
            expect(pedidoSalvo.id).toEqual(1);
            expect(pedidoSalvo.clienteId).toEqual(novoPedido.clienteId);
            expect(pedidoSalvo.dataInicio).toEqual(novoPedido.dataInicio);
            expect(pedidoSalvo.estadoPedido).toEqual(novoPedido.estadoPedido);
         });
      });

      it('não deve criar novo pedido com estado que não seja RECEBIDO (1)', async () => {
         await expect(service.save({ ...pedido, estadoPedido: EstadoPedido.FINALIZADO })).rejects.toThrowError(
            EstadoCorretoNovoPedidoValidator.ERROR_MESSAGE,
         );
      });

      it('não deve criar um novo pedido quando houver um erro de banco ', async () => {
         const error = new RepositoryException('Erro genérico de banco de dados');
         jest.spyOn(pedidoRepository, 'save').mockRejectedValue(error);

         // verifiaca se foi lançada uma exception na camada de serviço
         await expect(service.save(pedido)).rejects.toThrowError(ServiceException);
      });
   });

   describe('edit', () => {
      it('editar deve editar um pedido', async () => {
         await service.edit(pedido).then((pedidoEditado) => {
            expect(pedidoEditado.clienteId).toEqual(pedido.clienteId);
            expect(pedidoEditado.dataInicio).toEqual(pedido.dataInicio);
            expect(pedidoEditado.estadoPedido).toEqual(pedido.estadoPedido);
            expect(pedidoEditado.id).toEqual(pedido.id);
         });
      });

      it('não deve editar produto quando houver um erro de banco ', async () => {
         const error = new RepositoryException('Erro genérico de banco de dados');
         jest.spyOn(pedidoRepository, 'edit').mockRejectedValue(error);

         // verifica se foi lançada uma exception na camada de serviço
         await expect(service.edit(pedido)).rejects.toThrowError(ServiceException);
      }); // end it não deve editar produto quando houver um erro de banco
   });

   describe('delete', () => {
      it('deletar pedido', async () => {
         await service.delete(1).then((result) => expect(result).toBeTruthy());
      });

      it('não deve deletar produto quando houver um erro de banco ', async () => {
         const error = new RepositoryException('Erro genérico de banco de dados');
         jest.spyOn(pedidoRepository, 'delete').mockRejectedValue(error);

         // verifica se foi lançada uma exception na camada de serviço
         await expect(service.delete(1)).rejects.toThrowError(ServiceException);
      }); // end it não deve deletar produto quando houver um erro de banco
   });

   describe('buscar por ID', () => {
      it('encontra pedido por id', async () => {
         pedidoRepository.find = jest.fn().mockImplementation(() => {
            return Promise.resolve([pedido]);
         });
         await service.findById(1).then((pedidoEncontrado) => {
            expect(pedidoEncontrado).toEqual(pedido);
         });
      });

      it('não encontra pedido por id', async () => {
         pedidoRepository.find = jest.fn().mockImplementation(() => {
            return Promise.resolve([]);
         });
         await service.findById(2).then((pedidoEncontrado) => {
            expect(pedidoEncontrado).toEqual(undefined);
         });
      });

      it('não deve encontrar pedido por id quando houver um erro de banco ', async () => {
         const error = new RepositoryException('Erro genérico de banco de dados');
         jest.spyOn(pedidoRepository, 'find').mockRejectedValue(error);

         await expect(service.findById(1)).rejects.toThrowError(ServiceException);
      });
   });

   describe('findByIdEstadoProduto', () => {
      it('retorna estado do produto de ID 1 como Recebido (1)', async () => {
         pedidoRepository.findBy = jest.fn().mockImplementation((attributes) => {
            return Promise.resolve(attributes['id'] === pedido.id ? [pedido] : undefined);
         });

         await service.findByIdEstadoDoPedido(1).then((pedido) => {
            expect(pedido).toEqual({ estadoPedido: EstadoPedido.PAGAMENTO_PENDENTE });
         });
      });

      it('não encontra produto de ID 2', async () => {
         await service.findByIdEstadoDoPedido(2).then((pedidoEncontrado) => {
            expect(pedidoEncontrado).toEqual(undefined);
         });
      });

      it('não deve encontrar pedido por ID quando houver um erro de banco ', async () => {
         const error = new RepositoryException('Erro genérico de banco de dados');
         jest.spyOn(pedidoRepository, 'findBy').mockRejectedValue(error);

         // verifica se foi lançada uma exception na camada de serviço
         await expect(service.findByIdEstadoDoPedido(1)).rejects.toThrowError(ServiceException);
      });
   });

   describe('findAllByEstadoPedido', () => {
      const mockedPedidos = [pedido];
      it('retorna pedidos com estado - Pagamento Pendente (0)', async () => {
         pedidoRepository.findBy = jest.fn().mockImplementation((attributes: Partial<Pedido>) => {
            return Promise.resolve(mockedPedidos.filter((pedido) => pedido.estadoPedido === attributes.estadoPedido));
         });

         await service.findAllByEstadoDoPedido(EstadoPedido.PAGAMENTO_PENDENTE).then((pedidos) => {
            expect(pedidos).toEqual([pedido]);
         });
      });

      it('nao retorna produtos com estado - EM PREPARO (2)', async () => {
         pedidoRepository.findBy = jest.fn().mockImplementation((attributes: Partial<Pedido>) => {
            return Promise.resolve(mockedPedidos.filter((pedido) => pedido.estadoPedido === attributes.estadoPedido));
         });

         await service.findAllByEstadoDoPedido(EstadoPedido.EM_PREPARACAO).then((pedidos) => {
            expect(pedidos).toHaveLength(0);
         });
      });

      it('nao retorna produtos com estado - PRONTO (3)', async () => {
         pedidoRepository.findBy = jest.fn().mockImplementation((attributes: Partial<Pedido>) => {
            return Promise.resolve(mockedPedidos.filter((pedido) => pedido.estadoPedido === attributes.estadoPedido));
         });

         await service.findAllByEstadoDoPedido(EstadoPedido.PRONTO).then((pedidos) => {
            expect(pedidos).toHaveLength(0);
         });
      });

      it('nao retorna produtos com estado - FINALIZADO (4)', async () => {
         pedidoRepository.findBy = jest.fn().mockImplementation((attributes: Partial<Pedido>) => {
            return Promise.resolve(mockedPedidos.filter((pedido) => pedido.estadoPedido === attributes.estadoPedido));
         });

         await service.findAllByEstadoDoPedido(EstadoPedido.FINALIZADO).then((pedidos) => {
            expect(pedidos).toHaveLength(0);
         });
      });

      it('não deve encontrar pedidos por ESTADO quando houver um erro de banco ', async () => {
         const error = new RepositoryException('Erro genérico de banco de dados');
         jest.spyOn(pedidoRepository, 'findBy').mockRejectedValue(error);

         // verifica se foi lançada uma exception na camada de serviço
         await expect(service.findAllByEstadoDoPedido(EstadoPedido.FINALIZADO)).rejects.toThrowError(ServiceException);
      });
   });

   describe('listarPedidosPendentes', () => {
      it('deve listar pedidos pendentes', async () => {
         await service.listarPedidosPendentes().then((pedidos) => {
            expect(pedidos).toEqual([pedidoPendente]);
         });
      });

      it('não deve encontrar pedido pendente quando houver um erro de banco ', async () => {
         const error = new RepositoryException('Erro genérico de banco de dados');
         jest.spyOn(pedidoRepository, 'listarPedidosPendentes').mockRejectedValue(error);

         await expect(service.listarPedidosPendentes()).rejects.toThrowError(ServiceException);
      });
   });

   describe('listarPedidosNaoFinalizados', () => {
      it('deve listar pedidos pendentes', async () => {
         await service.listarPedidosNaoFinalizados().then((pedidos) => {
            expect(pedidos).toEqual(todosOsPedidos);
         });
      });

      it('não deve encontrar pedido pendente quando houver um erro de banco ', async () => {
         const error = new RepositoryException('Erro genérico de banco de dados');
         jest.spyOn(pedidoRepository, 'find').mockRejectedValue(error);

         await expect(service.listarPedidosNaoFinalizados()).rejects.toThrowError(ServiceException);
      });
   });

   describe('checkout', () => {
      it('deve chamar o caso de uso de checkout com o pedido correto', async () => {
         const expectedResult = {
            pagamento: {
               dataHoraPagamento: undefined,
               estadoPagamento: 0,
               id: 1,
               pedidoId: 1,
               total: 0,
               transacaoId: '863c99369e3d033aa1f080419d0502b226b3718945ba425481c9f565a85be8c8',
            },
            pedido,
         };
         const resultado = await service.checkout(pedido);
         expect(resultado).toEqual(expectedResult);
      });
   });

   describe('buscarItensPedidoPorPedidoId', () => {
      it('deve chamar o caso de uso de buscar itens por pedido ID com o ID correto', async () => {
         jest.spyOn(itemPedidoRepository, 'findBy').mockResolvedValue(itensPedidoMock);

         const pedidoId = 1;
         const resultado = await service.buscarItensPedidoPorPedidoId(pedidoId);
         expect(resultado).toEqual(itensPedidoMock);
      });
   });
});
