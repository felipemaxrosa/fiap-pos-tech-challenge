import { Test, TestingModule } from '@nestjs/testing';
import { PagamentoProviders } from 'src/application/pagamento/providers/pagamento.providers';
import { PedidoProviders } from 'src/application/pedido/providers/pedido.providers';
import { ServiceException } from 'src/enterprise/exception/service.exception';

import { EstadoPagamento } from 'src/enterprise/pagamento/enum/estado-pagamento.enum';
import { Pagamento } from 'src/enterprise/pagamento/model/pagamento.model';
import { IRepository } from 'src/enterprise/repository/repository';
import { PersistenceInMemoryProviders } from 'src/infrastructure/persistence/providers/persistence-in-memory.providers';
import { PagamentoConstants } from 'src/shared/constants';
import { ConsultaEstadoPagamentoPedidoUseCase } from './consulta-estado-pagamento-pedido.usecase';

describe('ConsultaEstadoPagamentoPedidoUseCase', () => {
   let useCase: ConsultaEstadoPagamentoPedidoUseCase;
   let repository: IRepository<Pagamento>;

   const mockedPagamento: Pagamento = {
      dataHoraPagamento: new Date(),
      estadoPagamento: EstadoPagamento.CONFIRMADO,
      pedidoId: 1,
      total: 10,
      transacaoId: '1',
      id: 1,
   };

   beforeEach(async () => {
      const module: TestingModule = await Test.createTestingModule({
         providers: [...PedidoProviders, ...PagamentoProviders, ...PersistenceInMemoryProviders],
      }).compile();

      // Desabilita a saída de log
      module.useLogger(false);

      useCase = module.get<ConsultaEstadoPagamentoPedidoUseCase>(PagamentoConstants.CONSULTA_ESTADO_PAGAMENTO_USECASE);
      repository = module.get<IRepository<Pagamento>>(PagamentoConstants.IREPOSITORY);
   });

   describe('buscarEstadoPedidoPorId', () => {
      it('deve buscar o estado de um pagamento por ID do pedido com sucesso', async () => {
         jest.spyOn(repository, 'findBy').mockResolvedValue([mockedPagamento]);

         const result = await useCase.buscaEstadoPagamento(1);

         expect(result).toEqual({ estadoPagamento: mockedPagamento.estadoPagamento });
      });

      it('deve retornar undefined quando o pagamento não for encontrado', async () => {
         jest.spyOn(repository, 'findBy').mockResolvedValue([]);

         const result = await useCase.buscaEstadoPagamento(2);

         expect(result).toBeUndefined();
      });

      it('deve lançar uma ServiceException em caso de erro no repositório', async () => {
         const error = new Error('Erro no repositório');
         jest.spyOn(repository, 'findBy').mockRejectedValue(error);

         await expect(useCase.buscaEstadoPagamento(3)).rejects.toThrowError(ServiceException);
      });
   });
});
