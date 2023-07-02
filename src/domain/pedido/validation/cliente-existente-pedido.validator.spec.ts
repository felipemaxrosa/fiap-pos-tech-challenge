import { Test, TestingModule } from '@nestjs/testing';

import { IRepository } from 'src/domain/repository/repository';
import { Pedido } from '../model/pedido.model';
import { EstadoPedido } from '../enums/pedido';
import { ClienteExistentePedidoValidator } from './cliente-existente-pedido.validator';
import { Cliente } from 'src/domain/cliente/model/cliente.model';

describe('ClienteExistentePedidoValidator', () => {
   let validator: ClienteExistentePedidoValidator;
   let repository: IRepository<Cliente>;

   const pedido: Pedido = {
      id: 1,
      clienteId: 1,
      dataInicio: '2023-06-18',
      estadoPedido: EstadoPedido.RECEBIDO,
      ativo: true,
   };

   const cliente: Cliente = {
      id: 1,
      nome: 'Teste',
      email: 'teste@teste.com',
      cpf: '25634428777',
   };


   beforeEach(async () => {
      // Configuração do módulo de teste
      const module: TestingModule = await Test.createTestingModule({
         providers: [
            ClienteExistentePedidoValidator,
            // Mock do serviço IRepository<Pedido>
            {
               provide: 'IRepository<Cliente>',
               useValue: {
                  findBy: jest.fn(() => {
                     return Promise.resolve([cliente]);
                  }),
               },
            },
         ],
      }).compile();

      // Desabilita a saída de log
      module.useLogger(false);

      // Obtém a instância do serviço e repositório a partir do módulo de teste
      repository = module.get<IRepository<Cliente>>('IRepository<Cliente>');
      validator = module.get<ClienteExistentePedidoValidator>(ClienteExistentePedidoValidator);
   });

   describe('injeção de dependências', () => {
      it('deve existir instância de repositório definida', async () => {
         expect(repository).toBeDefined();
      });
   });

   describe('validate', () => {
      it('deve validar pedido quando existir um cliente', async () => {
         await validator.validate(pedido)
            .then((result) => {
               expect(result).toBeTruthy();
            });
      });


      it('não deve validar pedido quando não existir um cliente', async () => {

         repository.findBy = jest.fn().mockImplementation(() => {
            return Promise.resolve([]);
         });

         await expect(validator.validate(pedido)).rejects.toThrowError(
            ClienteExistentePedidoValidator.ERROR_MESSAGE,
         );
      });
   });
});
