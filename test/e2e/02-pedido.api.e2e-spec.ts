import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { EstadoPedido } from 'src/enterprise/pedido/enums/pedido';
import { MainModule } from 'src/main.module';
import { SalvarPedidoRequest } from 'src/presentation/rest/pedido/request';
import { CheckoutPedidoResponse } from 'src/presentation/rest/pedido/response/checkout-pedido.response';
import { SalvarPedidoResponse } from 'src/presentation/rest/pedido/response/salvar-pedido.response';
import * as request from 'supertest';

describe('PedidoRestApi (e2e)', () => {
   let app: INestApplication;
   let salvarPedidoRequest: SalvarPedidoRequest;
   let salvarPedidoResponse: SalvarPedidoResponse;
   let checkoutResponse: CheckoutPedidoResponse;

   beforeEach(() => {
      // Define um objeto de requisição
      salvarPedidoRequest = {
         clienteId: 1,
         dataInicio: '2023-06-24',
         estadoPedido: EstadoPedido.PAGAMENTO_PENDENTE,
         ativo: true,
      };
      // Define um objeto de pedido esperado como resultado
      salvarPedidoResponse = {
         id: 1,
         clienteId: 1,
         dataInicio: '2023-06-24',
         estadoPedido: EstadoPedido.PAGAMENTO_PENDENTE,
         ativo: true,
      };

      // Response esperada para checkout
      checkoutResponse = {
         id: 1,
         clienteId: 1,
         dataInicio: '2023-06-24',
         estadoPedido: EstadoPedido.PAGAMENTO_PENDENTE,
         ativo: true,
         total: 0,
      };
   });

   beforeAll(async () => {
      // Configuração do módulo de teste
      const module: TestingModule = await Test.createTestingModule({
         imports: [MainModule],
      }).compile();

      // Desabilita a saída de log
      module.useLogger(false);

      app = module.createNestApplication();

      // Configuração de validações global inputs request
      app.useGlobalPipes(new ValidationPipe({ stopAtFirstError: true }));
      await app.init();
   });

   afterAll(async () => {
      await app.close();
   });

   it('POST /v1/pedido - Deve criar um novo pedido e retornar o ID', async () => {
      // realiza requisição e compara a resposta
      return await request(app.getHttpServer())
         .post('/v1/pedido')
         .set('Content-type', 'application/json')
         .send(salvarPedidoRequest)
         .then((response) => {
            expect(response.status).toEqual(201);
            expect(response.body).toEqual(salvarPedidoResponse);
            expect(response.body).toHaveProperty('id');
            expect(response.body.clienteId).toEqual(salvarPedidoRequest.clienteId);
         });
   });

   // it('GET /v1/pedido/checkout/1 - Deve realizer o checkout e retornar o novo objeto pedido', async () => {
   //    // realiza requisição e compara a resposta
   //    return await request(app.getHttpServer())
   //       .get('/v1/pedido/checkout/1')
   //       .set('Content-type', 'application/json')
   //       .then((response) => {
   //          expect(response.status).toEqual(201);
   //          expect(response.body).toEqual(checkoutResponse);
   //       });
   // });
});
