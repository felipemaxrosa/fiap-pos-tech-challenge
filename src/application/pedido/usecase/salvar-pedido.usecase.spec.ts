import { Test, TestingModule } from '@nestjs/testing';
import { PagamentoProviders } from 'src/application/pagamento/providers/pagamento.providers';
import { PedidoProviders } from 'src/application/pedido/providers/pedido.providers';
import { Cliente } from 'src/enterprise/cliente/model/cliente.model';
import { ServiceException } from 'src/enterprise/exception/service.exception';
import { EstadoPedido } from 'src/enterprise/pedido/enums/pedido';
import { IPedidoRepository } from 'src/enterprise/pedido/repository/pedido.repository.interface';
import { PersistenceInMemoryProviders } from 'src/infrastructure/persistence/providers/persistence-in-memory.providers';
import { ClienteConstants, PedidoConstants } from 'src/shared/constants';
import { SalvarPedidoUseCase } from './salvar-pedido.usecase';
import { DateUtils } from 'src/shared/date.utils';

describe('SalvarPedidoUseCase', () => {
   let useCase: SalvarPedidoUseCase;
   let repository: IPedidoRepository;

   const pedidoMock = {
      id: 1,
      clienteId: 101,
      dataInicio: DateUtils.toString(new Date()),
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
            ...PagamentoProviders,
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
                  save: jest.fn(() => Promise.resolve(pedidoMock)),
               },
            },
         ],
      }).compile();

      // Desabilita a saída de log
      module.useLogger(false);

      useCase = module.get<SalvarPedidoUseCase>(PedidoConstants.SALVAR_PEDIDO_USECASE);
      repository = module.get<IPedidoRepository>(PedidoConstants.IREPOSITORY);
   });

   describe('salvarPedido', () => {
      it('deve salvar um novo pedido com sucesso', async () => {
         jest.spyOn(repository, 'save').mockResolvedValue(pedidoMock);

         const result = await useCase.salvarPedido(pedidoMock);

         expect(result).toEqual(pedidoMock);
      });

      it('deve lançar uma ServiceException em caso de erro ao salvar', async () => {
         const error = new Error('Erro ao salvar');
         jest.spyOn(repository, 'save').mockRejectedValue(error);

         await expect(useCase.salvarPedido(pedidoMock)).rejects.toThrowError(ServiceException);
      });
   });
});
