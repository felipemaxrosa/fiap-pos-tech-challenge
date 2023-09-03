import { Test, TestingModule } from '@nestjs/testing';
import { PedidoExistenteValidator } from './pedido-existente.validator';
import { IRepository } from 'src/enterprise/repository/repository';
import { Pedido } from 'src/enterprise/pedido/model/pedido.model';
import { ValidationException } from 'src/enterprise/exception/validation.exception';
import { PedidoConstants } from 'src/shared/constants';
import { EstadoPedido } from 'src/enterprise/pedido/enums/pedido';
import { ItemPedido } from 'src/enterprise/item-pedido/model';

describe('PedidoExistenteValidator', () => {
   let validator: PedidoExistenteValidator;
   let repository: IRepository<Pedido>;

   const pedido: Pedido = {
      id: 1,
      clienteId: 1,
      dataInicio: '2023-06-18',
      estadoPedido: EstadoPedido.RECEBIDO,
      ativo: true,
   };

   const itemPedido: ItemPedido = {
      pedidoId: 1,
      produtoId: 2,
      quantidade: 3,
      id: 123,
   };

   beforeEach(async () => {
      const module: TestingModule = await Test.createTestingModule({
         providers: [
            PedidoExistenteValidator,
            {
               provide: PedidoConstants.IREPOSITORY,
               useValue: {
                  findBy: jest.fn(() => {
                     return Promise.resolve([pedido]);
                  }),
               },
            },
         ],
      }).compile();

      module.useLogger(false);

      repository = module.get<IRepository<Pedido>>(PedidoConstants.IREPOSITORY);
      validator = module.get<PedidoExistenteValidator>(PedidoExistenteValidator);
   });

   describe('injeção de dependências', () => {
      it('deve existir instância de repositório definida', async () => {
         expect(repository).toBeDefined();
      });
   });

   describe('validate', () => {
      it('deve validar pedido quando existir um pedido', async () => {
         const result = await validator.validate(itemPedido);

         expect(result).toBeTruthy();
      });

      it('não deve validar pedido quando não existir um pedido', async () => {
         repository.findBy = jest.fn().mockImplementation(() => Promise.resolve([]));

         await expect(validator.validate(itemPedido)).rejects.toThrowError(ValidationException);
      });
   });
});
