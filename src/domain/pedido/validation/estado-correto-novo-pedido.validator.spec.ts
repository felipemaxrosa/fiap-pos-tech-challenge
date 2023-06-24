import { Test, TestingModule } from '@nestjs/testing';

import { IRepository } from 'src/domain/repository/repository';
import { Pedido } from '../model/pedido.model';
import { EstadoCorretoNovoPedidoValidator } from './estado-correto-novo-pedido.validator';
import { ESTADO_PEDIDO } from '../enums/pedido';
import { PedidoConstants } from 'src/shared/constants';

describe('EstadoCorretoNovoPedidoValidator', () => {
   let validator: EstadoCorretoNovoPedidoValidator;
   let repository: IRepository<Pedido>;

   const pedidoPadrao: Pedido = {
      id: 1,
      clienteId: 1,
      dataInicio: '2023-06-18',
      estadoPedido: ESTADO_PEDIDO.RECEBIDO,
      ativo: true,
   };

   const criarNovoPedido = (props?: Partial<Pedido>): Pedido => {
      return {
         ...pedidoPadrao,
         ...props,
      };
   };

   beforeEach(async () => {
      // Configuração do módulo de teste
      const module: TestingModule = await Test.createTestingModule({
         providers: [
            EstadoCorretoNovoPedidoValidator,
            // Mock do serviço IRepository<Pedido>
            {
               provide: PedidoConstants.IREPOSITORY,
               useValue: {
                  findBy: jest.fn(() => {
                     // retorna vazio, sumulando que não encontrou registros pelo atributos passados por parâmetro
                     return Promise.resolve({});
                  }),
               },
            },
         ],
      }).compile();

      // Desabilita a saída de log
      module.useLogger(false);

      // Obtém a instância do serviço e repositório a partir do módulo de teste
      repository = module.get<IRepository<Pedido>>(PedidoConstants.IREPOSITORY);
      validator = module.get<EstadoCorretoNovoPedidoValidator>(EstadoCorretoNovoPedidoValidator);
   });

   describe('injeção de dependências', () => {
      it('deve existir instância de repositório definida', async () => {
         expect(repository).toBeDefined();
      });
   });

   describe('validate', () => {
      it('deve validar estado do novo pedido', async () => {
         await validator.validate(criarNovoPedido()).then((unique) => {
            expect(unique).toBeTruthy();
         });
      });

      it('deve disparar um ERRO devido ao estado invalido do novo pedido - FINALIZADO', async () => {
         const pedidoComEstadoErrado = criarNovoPedido({ estadoPedido: ESTADO_PEDIDO.FINALIZADO });
         // mock de repositório retornando um cliente
         repository.findBy = jest.fn().mockImplementation(() => {
            return Promise.resolve([pedidoComEstadoErrado]);
         });

         await expect(validator.validate(pedidoComEstadoErrado)).rejects.toThrowError(
            EstadoCorretoNovoPedidoValidator.ERROR_MESSAGE,
         );
      });

      it('deve disparar um ERRO devido ao estado invalido do novo pedido - EM PREPARO', async () => {
         const pedidoComEstadoErrado = criarNovoPedido({ estadoPedido: ESTADO_PEDIDO.EM_PREPARO });
         // mock de repositório retornando um cliente
         repository.findBy = jest.fn().mockImplementation(() => {
            return Promise.resolve([pedidoComEstadoErrado]);
         });

         await expect(validator.validate(pedidoComEstadoErrado)).rejects.toThrowError(
            EstadoCorretoNovoPedidoValidator.ERROR_MESSAGE,
         );
      });

      it('deve disparar um ERRO devido ao estado invalido do novo pedido - PRONTO', async () => {
         const pedidoComEstadoErrado = criarNovoPedido({ estadoPedido: ESTADO_PEDIDO.PRONTO });
         // mock de repositório retornando um cliente
         repository.findBy = jest.fn().mockImplementation(() => {
            return Promise.resolve([pedidoComEstadoErrado]);
         });

         await expect(validator.validate(pedidoComEstadoErrado)).rejects.toThrowError(
            EstadoCorretoNovoPedidoValidator.ERROR_MESSAGE,
         );
      });
   });
});
