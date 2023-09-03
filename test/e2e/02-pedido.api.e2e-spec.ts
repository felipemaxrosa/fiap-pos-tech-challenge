import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { EstadoPedido } from 'src/enterprise/pedido/enums/pedido';
import { MainModule } from 'src/main.module';
import { SalvarPedidoRequest } from 'src/presentation/rest/pedido/request';
import { EditarPedidoRequest } from 'src/presentation/rest/pedido/request/editar-pedido.request';
import { SalvarPedidoResponse } from 'src/presentation/rest/pedido/response/salvar-pedido.response';
import * as request from 'supertest';

describe('PedidoRestApi (e2e)', () => {
   let app: INestApplication;
   let salvarPedidoRequest: SalvarPedidoRequest;
   let editarPedidoRequest: EditarPedidoRequest;
   let salvarPedidoResponse: SalvarPedidoResponse;

   // Define um objeto de requisição
   const salvarClienteRequest = {
      nome: 'Teste',
      email: 'teste@teste.com',
      cpf: '25634428777',
   };

   beforeEach(() => {
      // Define um objeto de requisição
      salvarPedidoRequest = {
         clienteId: 1,
         dataInicio: '2023-06-24',
         estadoPedido: EstadoPedido.PAGAMENTO_PENDENTE,
         ativo: true,
      };

      // Define um objeto de edição de requisição
      editarPedidoRequest = {
         clienteId: 1,
         dataInicio: '2023-01-01',
         estadoPedido: EstadoPedido.FINALIZADO,
         ativo: false,
      };

      // Define um objeto de pedido esperado como resultado
      salvarPedidoResponse = {
         id: 1,
         clienteId: 1,
         dataInicio: '2023-06-24',
         estadoPedido: EstadoPedido.PAGAMENTO_PENDENTE,
         ativo: true,
      };
   });

   beforeAll(async () => {
      // Configuração do módulo de teste
      const module: TestingModule = await Test.createTestingModule({
         imports: [MainModule],
      }).compile();

      // Desabilita a saída de log
      //odule.useLogger(false);

      app = module.createNestApplication();

      // Configuração de validações global inputs request
      app.useGlobalPipes(new ValidationPipe({ stopAtFirstError: true }));
      await app.init();

      // salvar cliente mandatório
      //TODO: remover quando reutilizar TestingModule entre os testes
      if (process.env.NODE_ENV === 'local-mock-repository') {
         await request(app.getHttpServer())
            .post('/v1/cliente')
            .set('Content-type', 'application/json')
            .send(salvarClienteRequest);
      }
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

   it('PUT /v1/pedido/:id - Deve editar um pedido existente e retornar o pedido editado', async () => {
      const pedidoId = 1;

      return await request(app.getHttpServer())
         .put(`/v1/pedido/${pedidoId}`)
         .set('Content-type', 'application/json')
         .send(editarPedidoRequest)
         .then((response) => {
            expect(response.status).toEqual(200);
            expect(response.body.clienteId).toEqual(editarPedidoRequest.clienteId);
            expect(response.body.dataInicio).toEqual(editarPedidoRequest.dataInicio);
            expect(response.body.estadoPedido).toEqual(editarPedidoRequest.estadoPedido);
            expect(response.body.ativo).toEqual(editarPedidoRequest.ativo);
         });
   });

   it('PUT /v1/pedido/:id - Deve retornar um erro se o pedido não existir', async () => {
      const pedidoId = 999;

      const response = await request(app.getHttpServer())
         .put(`/v1/pedido/${pedidoId}`)
         .set('Content-type', 'application/json')
         .send(editarPedidoRequest);

      expect(response.status).toEqual(400);
   });

   it('POST /v1/pedido/checkout- Deve realizar o checkout e retornar o novo objeto pedido', async () => {
      // realiza requisição e compara a resposta
      return await request(app.getHttpServer())
         .post('/v1/pedido/checkout/1')
         .set('Content-type', 'application/json')
         .then((response) => {
            expect(response.status).toEqual(200);
            expect(response.body.estadoPedido).toEqual(EstadoPedido.FINALIZADO);
         });
   });
});
