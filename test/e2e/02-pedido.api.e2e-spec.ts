import * as request from 'supertest';
import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { EstadoPedido } from 'src/enterprise/pedido/enums/pedido';
import { MainModule } from 'src/main.module';
import { SalvarPedidoRequest } from 'src/presentation/rest/pedido/request';
import { SalvarPedidoResponse } from 'src/presentation/rest/pedido/response/salvar-pedido.response';

describe('PedidoRestApi (e2e)', () => {
   let app: INestApplication;
   let salvarPedidoRequest: SalvarPedidoRequest;
   let salvarPedidoResponse: SalvarPedidoResponse;

   beforeEach(() => {
      // Define um objeto de requisição
      salvarPedidoRequest = {
         clienteId: 1,
         dataInicio: '2023-06-24',
         estadoPedido: EstadoPedido.RECEBIDO,
         ativo: true,
      };
      // Define um objeto de pedido esperado como resultado
      salvarPedidoResponse = {
         id: 1,
         clienteId: 1,
         dataInicio: '2023-06-24',
         estadoPedido: EstadoPedido.RECEBIDO,
         ativo: true,
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
});
