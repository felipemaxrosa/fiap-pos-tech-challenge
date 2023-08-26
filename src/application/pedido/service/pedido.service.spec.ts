import { Test, TestingModule } from '@nestjs/testing';
import { PedidoService } from 'src/application/pedido/service/pedido.service';
import { IPedidoService } from 'src/application/pedido/service/pedido.service.interface';
import { ServiceException } from 'src/enterprise/exception/service.exception';
import { EstadoPedido } from 'src/enterprise/pedido/enums/pedido';
import { Pedido } from 'src/enterprise/pedido/model/pedido.model';
import { IPedidoRepository } from 'src/enterprise/pedido/repository/pedido.repository.interface';
import { EstadoCorretoNovoPedidoValidator } from 'src/application/pedido/validation/estado-correto-novo-pedido.validator';
import { SalvarPedidoValidator } from 'src/application/pedido/validation/salvar-pedido.validator';
import { RepositoryException } from 'src/infrastructure/exception/repository.exception';
import { SalvarPedidoRequest } from 'src/presentation/rest/pedido/request';
import { PedidoConstants } from 'src/shared/constants';
import { BuscarEstadoPedidoPorIdUseCase } from 'src/application/pedido/usecase/buscar-estado-pedido-por-id.usecase';
import { BuscarPedidoPorIdUseCase } from 'src/application/pedido/usecase/buscar-pedido-por-id.usecase';
import { BuscarTodosPedidosPendentesUseCase } from 'src/application/pedido/usecase/buscar-todos-pedidos-pendentes.usecase';
import { BuscarTodosPedidosPorEstadoUseCase } from 'src/application/pedido/usecase/buscar-todos-pedidos-por-estado.usecase';
import { DeletarPedidoUseCase } from 'src/application/pedido/usecase/deletar-pedido.usecase';
import { EditarPedidoUseCase } from 'src/application/pedido/usecase/editar-pedido.usecase';
import { SalvarPedidoUseCase } from 'src/application/pedido/usecase/salvar-pedido.usecase';

describe('PedidoService', () => {
   let service: IPedidoService;
   let repository: IPedidoRepository;
   let validators: SalvarPedidoValidator[];

   const pedido: Pedido = {
      id: 1,
      clienteId: 1,
      dataInicio: '2023-06-18',
      estadoPedido: EstadoPedido.RECEBIDO,
      ativo: true,
   };

   const pedidoPendente: Pedido = {
      id: 2,
      clienteId: 2,
      dataInicio: '2023-06-20',
      estadoPedido: EstadoPedido.EM_PREPARO,
      ativo: true,
   };

   beforeEach(async () => {
      // Configuração do módulo de teste
      const module: TestingModule = await Test.createTestingModule({
         providers: [
            //  IService<Pedido> provider
            {
               provide: PedidoConstants.ISERVICE,
               inject: [
                  PedidoConstants.SALVAR_PEDIDO_USECASE,
                  PedidoConstants.EDITAR_PEDIDO_USECASE,
                  PedidoConstants.DELETAR_PEDIDO_USECASE,
                  PedidoConstants.BUSCAR_PEDIDO_POR_ID_USECASE,
                  PedidoConstants.BUSCAR_ESTADO_PEDIDO_POR_ID_USECASE,
                  PedidoConstants.BUSCAR_TODOS_PEDIDOS_POR_ESTADO_USECASE,
                  PedidoConstants.BUSCAR_TODOS_PEDIDOS_PENDENTES_USECASE,
               ],
               useFactory: (
                  salvarUsecase: SalvarPedidoUseCase,
                  editarUsecase: EditarPedidoUseCase,
                  deletarUsecase: DeletarPedidoUseCase,
                  buscarPorIdUsecase: BuscarPedidoPorIdUseCase,
                  buscarEstadoPorIdUsecase: BuscarEstadoPedidoPorIdUseCase,
                  buscarTodosPorEstadoUsecase: BuscarTodosPedidosPorEstadoUseCase,
                  buscarTodosPendentesUsecase: BuscarTodosPedidosPendentesUseCase,
               ): IPedidoService => {
                  return new PedidoService(
                     salvarUsecase,
                     editarUsecase,
                     deletarUsecase,
                     buscarPorIdUsecase,
                     buscarEstadoPorIdUsecase,
                     buscarTodosPorEstadoUsecase,
                     buscarTodosPendentesUsecase,
                  );
               },
            },
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
                  findByIdEstadoDoPedido: jest.fn(() => Promise.resolve({ estadoPedido: pedido.estadoPedido })),
                  // mock para a chamada repository.edit(produto)
                  edit: jest.fn(() => Promise.resolve(pedido)),
                  // mock para a chamada repository.delete(id)
                  delete: jest.fn(() => Promise.resolve(true)),
                  listarPedidosPendentes: jest.fn(() => Promise.resolve([pedidoPendente])),
               },
            },
            // Mock do SalvarPedidoValidator
            {
               provide: PedidoConstants.SALVAR_PEDIDO_VALIDATOR,
               inject: [PedidoConstants.IREPOSITORY],
               useFactory: (): SalvarPedidoValidator[] => {
                  return [new EstadoCorretoNovoPedidoValidator()];
               },
            },
            {
               provide: PedidoConstants.SALVAR_PEDIDO_USECASE,
               inject: [PedidoConstants.IREPOSITORY, PedidoConstants.SALVAR_PEDIDO_VALIDATOR],
               useFactory: (repository: IPedidoRepository, validators: SalvarPedidoValidator[]): SalvarPedidoUseCase =>
                  new SalvarPedidoUseCase(repository, validators),
            },
            {
               provide: PedidoConstants.EDITAR_PEDIDO_USECASE,
               inject: [PedidoConstants.IREPOSITORY, PedidoConstants.SALVAR_PEDIDO_VALIDATOR],
               useFactory: (repository: IPedidoRepository, validators: SalvarPedidoValidator[]): EditarPedidoUseCase =>
                  new EditarPedidoUseCase(repository, validators),
            },
            {
               provide: PedidoConstants.DELETAR_PEDIDO_USECASE,
               inject: [PedidoConstants.IREPOSITORY],
               useFactory: (repository: IPedidoRepository): DeletarPedidoUseCase =>
                  new DeletarPedidoUseCase(repository),
            },
            {
               provide: PedidoConstants.BUSCAR_PEDIDO_POR_ID_USECASE,
               inject: [PedidoConstants.IREPOSITORY],
               useFactory: (repository: IPedidoRepository): BuscarPedidoPorIdUseCase =>
                  new BuscarPedidoPorIdUseCase(repository),
            },
            {
               provide: PedidoConstants.BUSCAR_ESTADO_PEDIDO_POR_ID_USECASE,
               inject: [PedidoConstants.IREPOSITORY],
               useFactory: (repository: IPedidoRepository): BuscarEstadoPedidoPorIdUseCase =>
                  new BuscarEstadoPedidoPorIdUseCase(repository),
            },
            {
               provide: PedidoConstants.BUSCAR_TODOS_PEDIDOS_POR_ESTADO_USECASE,
               inject: [PedidoConstants.IREPOSITORY],
               useFactory: (repository: IPedidoRepository): BuscarTodosPedidosPorEstadoUseCase =>
                  new BuscarTodosPedidosPorEstadoUseCase(repository),
            },
            {
               provide: PedidoConstants.BUSCAR_TODOS_PEDIDOS_PENDENTES_USECASE,
               inject: [PedidoConstants.IREPOSITORY],
               useFactory: (repository: IPedidoRepository): BuscarTodosPedidosPendentesUseCase =>
                  new BuscarTodosPedidosPendentesUseCase(repository),
            },
         ],
      }).compile();

      // Desabilita a saída de log
      module.useLogger(false);

      // Obtém a instância do repositório, validators e serviço a partir do módulo de teste
      repository = module.get<IPedidoRepository>(PedidoConstants.IREPOSITORY);
      validators = module.get<SalvarPedidoValidator[]>(PedidoConstants.SALVAR_PEDIDO_VALIDATOR);
      service = module.get<IPedidoService>(PedidoConstants.ISERVICE);
   });

   describe('injeção de dependências', () => {
      it('deve existir instância de repositório definida', async () => {
         expect(repository).toBeDefined();
         expect(validators).toBeDefined();
      });
   });

   describe('save', () => {
      it('deve CRIAR novo pedido', async () => {
         const novoPedido: SalvarPedidoRequest = {
            clienteId: 1,
            dataInicio: '2023-06-18',
            estadoPedido: EstadoPedido.RECEBIDO,
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
         jest.spyOn(repository, 'save').mockRejectedValue(error);

         // verifiaca se foi lançada uma exception na camada de serviço
         await expect(service.save(pedido)).rejects.toThrowError(ServiceException);
      });
   });

   describe('edit', () => {
      it('editar deve falhar porque não foi implementado', async () => {
         await service.edit(pedido).then((pedidoEditado) => {
            expect(pedidoEditado.clienteId).toEqual(pedido.clienteId);
            expect(pedidoEditado.dataInicio).toEqual(pedido.dataInicio);
            expect(pedidoEditado.estadoPedido).toEqual(pedido.estadoPedido);
            expect(pedidoEditado.id).toEqual(pedido.id);
         });
      });

      it('não deve editar produto quando houver um erro de banco ', async () => {
         const error = new RepositoryException('Erro genérico de banco de dados');
         jest.spyOn(repository, 'edit').mockRejectedValue(error);

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
         jest.spyOn(repository, 'delete').mockRejectedValue(error);

         // verifica se foi lançada uma exception na camada de serviço
         await expect(service.delete(1)).rejects.toThrowError(ServiceException);
      }); // end it não deve deletar produto quando houver um erro de banco
   });

   describe('buscar por ID', () => {
      it('encontra pedido por id', async () => {
         repository.findBy = jest.fn().mockImplementation((attributes) => {
            return Promise.resolve(attributes['id'] === pedido.id ? [pedido] : undefined);
         });
         await service.findById(1).then((produtoEncontrado) => {
            expect(produtoEncontrado).toEqual(pedido);
         });
      });

      it('não encontra pedido por id', async () => {
         await service.findById(2).then((produtoEncontrado) => {
            expect(produtoEncontrado).toEqual(undefined);
         });
      });

      it('não deve encontrar pedido por id quando houver um erro de banco ', async () => {
         const error = new RepositoryException('Erro genérico de banco de dados');
         jest.spyOn(repository, 'findBy').mockRejectedValue(error);

         await expect(service.findById(1)).rejects.toThrowError(ServiceException);
      });
   });

   describe('findByIdEstadoProduto', () => {
      it('retorna estado do produto de ID 1 como Recebido (1)', async () => {
         repository.findBy = jest.fn().mockImplementation((attributes) => {
            return Promise.resolve(attributes['id'] === pedido.id ? [pedido] : undefined);
         });

         await service.findByIdEstadoDoPedido(1).then((pedido) => {
            expect(pedido).toEqual({ estadoPedido: EstadoPedido.RECEBIDO });
         });
      });

      it('não encontra produto de ID 2', async () => {
         await service.findByIdEstadoDoPedido(2).then((pedidoEncontrado) => {
            expect(pedidoEncontrado).toEqual(undefined);
         });
      });

      it('não deve encontrar pedido por ID quando houver um erro de banco ', async () => {
         const error = new RepositoryException('Erro genérico de banco de dados');
         jest.spyOn(repository, 'findBy').mockRejectedValue(error);

         // verifica se foi lançada uma exception na camada de serviço
         await expect(service.findByIdEstadoDoPedido(1)).rejects.toThrowError(ServiceException);
      });
   });

   describe('findAllByEstadoPedido', () => {
      const mockedPedidos = [pedido];
      it('retorna pedidos com estado - Recebido (1)', async () => {
         repository.findBy = jest.fn().mockImplementation((attributes: Partial<Pedido>) => {
            return Promise.resolve(mockedPedidos.filter((pedido) => pedido.estadoPedido === attributes.estadoPedido));
         });

         await service.findAllByEstadoDoPedido(EstadoPedido.RECEBIDO).then((pedidos) => {
            expect(pedidos).toEqual([pedido]);
         });
      });

      it('nao retorna produtos com estado - EM PREPARO (2)', async () => {
         repository.findBy = jest.fn().mockImplementation((attributes: Partial<Pedido>) => {
            return Promise.resolve(mockedPedidos.filter((pedido) => pedido.estadoPedido === attributes.estadoPedido));
         });

         await service.findAllByEstadoDoPedido(EstadoPedido.EM_PREPARO).then((pedidos) => {
            expect(pedidos).toHaveLength(0);
         });
      });

      it('nao retorna produtos com estado - PRONTO (3)', async () => {
         repository.findBy = jest.fn().mockImplementation((attributes: Partial<Pedido>) => {
            return Promise.resolve(mockedPedidos.filter((pedido) => pedido.estadoPedido === attributes.estadoPedido));
         });

         await service.findAllByEstadoDoPedido(EstadoPedido.PRONTO).then((pedidos) => {
            expect(pedidos).toHaveLength(0);
         });
      });

      it('nao retorna produtos com estado - FINALIZADO (4)', async () => {
         repository.findBy = jest.fn().mockImplementation((attributes: Partial<Pedido>) => {
            return Promise.resolve(mockedPedidos.filter((pedido) => pedido.estadoPedido === attributes.estadoPedido));
         });

         await service.findAllByEstadoDoPedido(EstadoPedido.FINALIZADO).then((pedidos) => {
            expect(pedidos).toHaveLength(0);
         });
      });

      it('não deve encontrar pedidos por ESTADO quando houver um erro de banco ', async () => {
         const error = new RepositoryException('Erro genérico de banco de dados');
         jest.spyOn(repository, 'findBy').mockRejectedValue(error);

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
         jest.spyOn(repository, 'listarPedidosPendentes').mockRejectedValue(error);

         await expect(service.listarPedidosPendentes()).rejects.toThrowError(ServiceException);
      });
   });
});
