import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';

import { MainModule } from '../../src/main.module';
import { CriarNovoPedidoRequest } from 'src/application/web/pedido/request';
import { Pedido } from 'src/domain/pedido/model/pedido.model';
import { EstadoPedido } from 'src/domain/pedido/enums/pedido';

describe('PedidoController (e2e)', () => {
   let app: INestApplication;
   let criarNovoPedidoRequest: CriarNovoPedidoRequest;
   let pedido: Pedido;

   beforeEach(() => {
      // Define um objeto de requisição
      criarNovoPedidoRequest = {
         clienteId: 1,
         dataInicio: '2023-06-24',
         estadoPedido: EstadoPedido.RECEBIDO,
         ativo: true,
      };
      // Define um objeto de pedido esperado como resultado
      pedido = {
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
         .send(criarNovoPedidoRequest)
         .then((response) => {
            expect(response.status).toEqual(201);
            expect(response.body).toEqual(pedido);
            expect(response.body).toHaveProperty('id');
            expect(response.body.clienteId).toEqual(criarNovoPedidoRequest.clienteId);
         });
   });
});
