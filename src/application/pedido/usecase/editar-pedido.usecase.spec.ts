import { Test, TestingModule } from '@nestjs/testing';
import { EditarPedidoUseCase } from './editar-pedido.usecase';
import { IPedidoRepository } from 'src/enterprise/pedido/repository/pedido.repository.interface';
import { ClienteConstants, PedidoConstants } from 'src/shared/constants';
import { PedidoProviders } from 'src/application/pedido/providers/pedido.providers';
import { PersistenceInMemoryProviders } from 'src/infrastructure/persistence/providers/persistence-in-memory.providers';
import { EstadoPedido } from 'src/enterprise/pedido/enums/pedido';
import { Cliente } from 'src/enterprise/cliente/model/cliente.model';
import { ServiceException } from 'src/enterprise/exception/service.exception';

describe('EditarPedidoUseCase', () => {
   let useCase: EditarPedidoUseCase;
   let repository: IPedidoRepository;

   const pedidoMock = {
      id: 1,
      clienteId: 101,
      dataInicio: '2023-08-26',
      estadoPedido: EstadoPedido.PAGAMENTO_PENDENTE,
      ativo: true,
   };

   const cliente: Cliente = {
      id: 1,
      nome: 'Teste',
      email: 'teste@teste.com',
      cpf: '25634428777',
   };

   beforeEach(async () => {
      const module: TestingModule = await Test.createTestingModule({
         providers: [
            ...PedidoProviders,
            ...PersistenceInMemoryProviders,
            // Mock do serviço IRepository<Cliente>
            {
               provide: ClienteConstants.IREPOSITORY,
               useValue: {
                  findBy: jest.fn(() => Promise.resolve([cliente])),
               },
            },
            // Mock do serviço IRepository<Pedido>
            {
               provide: PedidoConstants.IREPOSITORY,
               useValue: {
                  edit: jest.fn(() => Promise.resolve([pedidoMock])),
                  findBy: jest.fn(() => Promise.resolve([pedidoMock])),
               },
            },
         ],
      }).compile();

      // Desabilita a saída de log
      module.useLogger(false);

      useCase = module.get<EditarPedidoUseCase>(PedidoConstants.EDITAR_PEDIDO_USECASE);
      repository = module.get<IPedidoRepository>(PedidoConstants.IREPOSITORY);
   });

   describe('editarPedido', () => {
      it('deve editar um pedido com sucesso', async () => {
         jest.spyOn(repository, 'edit').mockResolvedValue(pedidoMock);

         const result = await useCase.editarPedido(pedidoMock);

         expect(result).toEqual(pedidoMock);
      });

      it('deve lançar uma ServiceException em caso de erro ao editar', async () => {
         const error = new Error('Erro ao editar');
         jest.spyOn(repository, 'edit').mockRejectedValue(error);

         await expect(useCase.editarPedido(pedidoMock)).rejects.toThrowError(ServiceException);
      });
   });
});
