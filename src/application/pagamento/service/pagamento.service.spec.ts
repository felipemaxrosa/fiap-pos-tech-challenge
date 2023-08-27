import { Test, TestingModule } from '@nestjs/testing';
import { PagamentoProviders } from 'src/application/pagamento/providers/pagamento.providers';
import { IPagamentoService } from 'src/application/pagamento/service/pagamento.service.interface';
import { Pagamento } from 'src/enterprise/pagamento/model/pagamento.model';
import { ServiceException } from 'src/enterprise/exception/service.exception';
import { IRepository } from 'src/enterprise/repository/repository';
import { RepositoryException } from 'src/infrastructure/exception/repository.exception';
import { PersistenceInMemoryProviders } from 'src/infrastructure/persistence/providers/persistence-in-memory.providers';
import { PagamentoConstants } from 'src/shared/constants';
import { EstadoPagamento } from 'src/enterprise/pagamento/enums/pagamento.enums';

describe('PagamentoService', () => {
   let service: IPagamentoService;
   let pagamentoRepository: IRepository<Pagamento>;

   const pagamento: Pagamento = {
      dataHoraPagamento: new Date(),
      estadoPagamento: EstadoPagamento.CONFIRMADO,
      pedidoId: 1,
      total: 10,
      transacaoId: 1,
      id: 1,
   };

   const pagamentos: Pagamento[] = [
      pagamento,
      {
         dataHoraPagamento: new Date(),
         estadoPagamento: EstadoPagamento.PENDENTE,
         pedidoId: 2,
         total: 20,
         transacaoId: 2,
         id: 2,
      },
   ];

   beforeEach(async () => {
      // Configuração do módulo de teste
      const module: TestingModule = await Test.createTestingModule({
         providers: [
            ...PagamentoProviders,
            ...PersistenceInMemoryProviders,
            // Mock do serviço IRepository<Pagamento>
            {
               provide: PagamentoConstants.IREPOSITORY,
               useValue: {
                  findBy: jest.fn(() => {
                     // retorna vazio, simulando que não encontrou registros pelo atributos passados por parâmetro
                     return Promise.resolve(pagamentos);
                  }),
                  // buscarEstadoPagamentoPedido: jest.fn(() => Promise.resolve(pagamentoEncontrado)),
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
});
