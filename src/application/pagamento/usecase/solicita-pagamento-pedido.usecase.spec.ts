import { Test, TestingModule } from '@nestjs/testing';
import { PagamentoProviders } from 'src/application/pagamento/providers/pagamento.providers';
import { SolicitaPagamentoPedidoUseCase } from 'src/application/pagamento/usecase/solicita-pagamento-pedido.usecase';
import { PedidoProviders } from 'src/application/pedido/providers/pedido.providers';
import { ServiceException } from 'src/enterprise/exception/service.exception';

import { EstadoPagamento } from 'src/enterprise/pagamento/enums/pagamento.enums';
import { Pagamento } from 'src/enterprise/pagamento/model/pagamento.model';
import { EstadoPedido } from 'src/enterprise/pedido/enums/pedido';
import { Pedido } from 'src/enterprise/pedido/model/pedido.model';
import { IRepository } from 'src/enterprise/repository/repository';
import { PersistenceInMemoryProviders } from 'src/infrastructure/persistence/providers/persistence-in-memory.providers';
import { PagamentoConstants } from 'src/shared/constants';

describe('SolicitaPagamentoPedidoUseCase', () => {
   let useCase: SolicitaPagamentoPedidoUseCase;
   let repository: IRepository<Pagamento>;

   const pedido: Pedido = {
      id: 1,
      clienteId: 1,
      dataInicio: '2023-08-30',
      estadoPedido: EstadoPedido.PAGAMENTO_PENDENTE,
      ativo: true,
      total: 10,
   };

   const pagamento: Pagamento = {
      dataHoraPagamento: new Date(),
      estadoPagamento: EstadoPagamento.PENDENTE,
      pedidoId: 1,
      total: 10,
      transacaoId: '123456-abcdef',
      id: 1,
   };

   beforeEach(async () => {
      const module: TestingModule = await Test.createTestingModule({
         providers: [...PedidoProviders, ...PagamentoProviders, ...PersistenceInMemoryProviders],
      }).compile();

      // Desabilita a saída de log
      module.useLogger(false);

      useCase = module.get<SolicitaPagamentoPedidoUseCase>(PagamentoConstants.SOLICITA_PAGAMENTO_PEDIDO_USECASE);
      repository = module.get<IRepository<Pagamento>>(PagamentoConstants.IREPOSITORY);
   });

   describe('SolicitaPagamentoPedidoUseCase', () => {
      it('deve realizar o pagamento do pedido e gerar o id de transação', async () => {
         jest.spyOn(repository, 'save').mockResolvedValue(pagamento);

         const pagamentoResponse = await useCase.solicitaPagamento(pedido);

         expect(pagamentoResponse.pedidoId).toEqual(pedido.id);
      });

      // it('deve retornar undefined quando o pagamento não for encontrado', async () => {
      //    jest.spyOn(repository, 'findBy').mockResolvedValue([]);
      //
      //    const result = await useCase.buscaEstadoPagamento(2);
      //
      //    expect(result).toBeUndefined();
      // });
      //
      it('deve lançar uma ServiceException em caso de erro no repositório', async () => {
         const error = new Error('Erro no repositório');
         jest.spyOn(repository, 'save').mockRejectedValue(error);

         await expect(useCase.solicitaPagamento(pedido)).rejects.toThrowError(ServiceException);
      });
   });
});
