import { Test, TestingModule } from '@nestjs/testing';
import { DataInicioNovoPedidoValidator } from './data-inicio-novo-pedido.validator';
import { Pedido } from 'src/enterprise/pedido/model/pedido.model';
import { ValidationException } from 'src/enterprise/exception/validation.exception';
import { DateUtils } from 'src/shared/date.utils';
import { EstadoPedido } from 'src/enterprise/pedido/enums/pedido';

describe('DataInicioNovoPedidoValidator', () => {
   let validator: DataInicioNovoPedidoValidator;

   beforeEach(async () => {
      const module: TestingModule = await Test.createTestingModule({
         providers: [DataInicioNovoPedidoValidator],
      }).compile();

      // Desabilita a saída de log
      module.useLogger(false);

      // Obtém a instância do validator a partir do módulo de teste
      validator = module.get<DataInicioNovoPedidoValidator>(DataInicioNovoPedidoValidator);
   });

   describe('validate', () => {
      it('deve passar na validação quando a data de início é a data atual', async () => {
         const pedido: Pedido = {
            id: 1,
            clienteId: 1,
            dataInicio: DateUtils.toString(new Date()),
            estadoPedido: EstadoPedido.RECEBIDO,
            ativo: true
         };

         const isValid = await validator.validate(pedido);
         expect(isValid).toBeTruthy();
      });

      it('deve lançar uma exceção de validação quando a data de início não é a data atual', async () => {
         const pedido: Pedido = {
            id: 1,
            clienteId: 1,
            dataInicio: '2020-01-01',
            estadoPedido: EstadoPedido.RECEBIDO,
            ativo: true
         };

         // O validator deve lançar uma exceção de validação
         await expect(validator.validate(pedido)).rejects.toThrowError(ValidationException);
      });
   });
});
