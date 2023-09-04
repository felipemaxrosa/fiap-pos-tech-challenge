import { Test, TestingModule } from '@nestjs/testing';
import { Pedido } from 'src/enterprise/pedido/model/pedido.model';
import { Pagamento } from 'src/enterprise/pagamento/model/pagamento.model';
import { ValidationException } from 'src/enterprise/exception/validation.exception';
import { IRepository } from 'src/enterprise/repository/repository';
import { PagamentoConstants } from 'src/shared/constants';
import { EstadoPedido } from 'src/enterprise/pedido/enum/estado-pedido.enum';
import { DateUtils } from 'src/shared/date.utils';
import { CheckoutPedidoRealizadoValidator } from 'src/application/pedido/validation/checkout-pedido-realizado-validator';
import { EstadoPagamento } from 'src/enterprise/pagamento/enum/estado-pagamento.enum';

describe('CheckoutPedidoRealizadoValidator', () => {
   let validator: CheckoutPedidoRealizadoValidator;
   let pagamentoRepository: IRepository<Pagamento>;

   const pagamento: Pagamento = {
      pedidoId: 1,
      transacaoId: '123-abc',
      estadoPagamento: EstadoPagamento.PENDENTE,
      total: 100,
      dataHoraPagamento: new Date(),
      id: 1,
   };

   beforeEach(async () => {
      // Configuração do módulo de teste
      const module: TestingModule = await Test.createTestingModule({
         providers: [
            CheckoutPedidoRealizadoValidator,
            // Mock do repositório de Pagamento
            {
               provide: PagamentoConstants.IREPOSITORY,
               useValue: {
                  findBy: jest.fn(() => {
                     // Retorna um pagamento vazio, simulando que não foi encontrado nenhum pagamento para o pedido
                     return Promise.resolve([]);
                  }),
               },
            },
         ],
      }).compile();

      // Obtém a instância do validator e do repositório a partir do módulo de teste
      validator = module.get<CheckoutPedidoRealizadoValidator>(CheckoutPedidoRealizadoValidator);
      pagamentoRepository = module.get<IRepository<Pagamento>>(PagamentoConstants.IREPOSITORY);
   });

   describe('validate', () => {
      it('deve passar na validação quando não há pagamento registrado para o pedido', async () => {
         const pedido: Pedido = {
            id: 1,
            clienteId: 1,
            dataInicio: DateUtils.toString(new Date()),
            estadoPedido: EstadoPedido.RECEBIDO,
            ativo: true,
         };

         const isValid = await validator.validate(pedido);
         expect(isValid).toBeTruthy();
      });

      it('deve lançar uma exceção de validação quando há pagamento registrado para o pedido', async () => {
         const pedido: Pedido = {
            id: 1,
            clienteId: 1,
            dataInicio: DateUtils.toString(new Date()),
            estadoPedido: EstadoPedido.RECEBIDO,
            ativo: true,
         };

         // Mock para retornar um pagamento, simulando que o pedido já realizou checkout
         pagamentoRepository.findBy = jest.fn(() => {
            return Promise.resolve([pagamento]);
         });

         // O validator deve lançar uma exceção de validação
         await expect(validator.validate(pedido)).rejects.toThrowError(ValidationException);
      });
   });
});
