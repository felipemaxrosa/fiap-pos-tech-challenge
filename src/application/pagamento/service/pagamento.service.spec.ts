import { Test, TestingModule } from '@nestjs/testing';
import { PagamentoProviders } from 'src/application/pagamento/providers/pagamento.providers';
import { IPagamentoService } from 'src/application/pagamento/service/pagamento.service.interface';
import { PedidoProviders } from 'src/application/pedido/providers/pedido.providers';
import { ServiceException } from 'src/enterprise/exception/service.exception';
import { EstadoPagamento } from 'src/enterprise/pagamento/enum/estado-pagamento.enum';
import { Pagamento } from 'src/enterprise/pagamento/model/pagamento.model';
import { EstadoPedido } from 'src/enterprise/pedido/enum/estado-pedido.enum';
import { Pedido } from 'src/enterprise/pedido/model/pedido.model';
import { IRepository } from 'src/enterprise/repository/repository';
import { RepositoryException } from 'src/infrastructure/exception/repository.exception';
import { PersistenceInMemoryProviders } from 'src/infrastructure/persistence/providers/persistence-in-memory.providers';
import { PagamentoConstants } from 'src/shared/constants';

describe('PagamentoService', () => {
   let service: IPagamentoService;
   let pagamentoRepository: IRepository<Pagamento>;

   const pagamento: Pagamento = {
      dataHoraPagamento: new Date(),
      estadoPagamento: EstadoPagamento.CONFIRMADO,
      pedidoId: 1,
      total: 10,
      transacaoId: '1',
      id: 1,
   };

   const pagamentos: Pagamento[] = [
      pagamento,
      {
         dataHoraPagamento: new Date(),
         estadoPagamento: EstadoPagamento.PENDENTE,
         pedidoId: 2,
         total: 20,
         transacaoId: '2',
         id: 2,
      },
   ];

   const pedido: Pedido = {
      id: 1,
      clienteId: 1,
      dataInicio: '2023-06-18',
      estadoPedido: EstadoPedido.PAGAMENTO_PENDENTE,
      ativo: true,
      total: 10,
   };

   const pagamentoSolicitado: Pagamento = {
      dataHoraPagamento: new Date(),
      estadoPagamento: EstadoPagamento.PENDENTE,
      pedidoId: 1,
      total: 10,
      transacaoId: '1',
      id: 1,
   };

   beforeEach(async () => {
      // Configuração do módulo de teste
      const module: TestingModule = await Test.createTestingModule({
         providers: [
            ...PagamentoProviders,
            ...PedidoProviders,
            ...PersistenceInMemoryProviders,
            // Mock do serviço IRepository<Pagamento>
            {
               provide: PagamentoConstants.IREPOSITORY,
               useValue: {
                  findBy: jest.fn(() => {
                     // retorna vazio, simulando que não encontrou registros pelo atributos passados por parâmetro
                     return Promise.resolve(pagamentos);
                  }),
                  save: jest.fn(() => {
                     // retorna o pagamentoSolicitado
                     return Promise.resolve(pagamentoSolicitado);
                  }),
               },
            },
         ],
      }).compile();

      // Desabilita a saída de log
      module.useLogger(false);

      // Obtém a instância do repositório, validators e serviço a partir do módulo de teste
      pagamentoRepository = module.get<IRepository<Pagamento>>(PagamentoConstants.IREPOSITORY);
      service = module.get<IPagamentoService>(PagamentoConstants.ISERVICE);
   });

   describe('injeção de dependências', () => {
      it('deve existir instância de repositório definida', async () => {
         expect(pagamentoRepository).toBeDefined();
         expect(service).toBeDefined();
      });
   });

   describe('buscarEstadoPagamentoPedido', () => {
      it('deve retornar estado do pagamento corretamente', async () => {
         await service.buscarEstadoPagamentoPedido(1).then((pagamento) => {
            expect(pagamento.estadoPagamento).toEqual(EstadoPagamento.CONFIRMADO);
         });
      });

      it('não deve encontrar pedido por id quando houver um erro de banco ', async () => {
         const error = new RepositoryException('Erro genérico de banco de dados');
         jest.spyOn(pagamentoRepository, 'findBy').mockRejectedValue(error);

         await expect(service.buscarEstadoPagamentoPedido(1)).rejects.toThrowError(ServiceException);
      });
   });

   describe('solicitarPagamentoPedido', () => {
      it('deve solicitar pagamento corretamente', async () => {
         await service.solicitarPagamentoPedido(pedido).then((pagamento) => {
            expect(pagamento.id).toEqual(pedido.id);
         });
      });
      it('não deve fazer solicitação de pagamento quando houver erro de banco ', async () => {
         const error = new RepositoryException('Erro genérico de banco de dados');
         jest.spyOn(pagamentoRepository, 'save').mockRejectedValue(error);

         await expect(service.solicitarPagamentoPedido(pedido)).rejects.toThrowError(ServiceException);
      });
   });
});
