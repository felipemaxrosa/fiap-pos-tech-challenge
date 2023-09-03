import * as request from 'supertest';
import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { MainModule } from 'src/main.module';
import { SalvarItemPedidoRequest, SalvarItemPedidoResponse } from 'src/presentation/rest/item-pedido';
import { EstadoPedido } from 'src/enterprise/pedido/enums/pedido';

describe('ItemPedidoRestApi (e2e)', () => {
   let app: INestApplication;
   let salvarItemPedidoRequest: SalvarItemPedidoRequest;
   let itemPedido: SalvarItemPedidoResponse;

   const salvarClienteRequest = {
      nome: 'Teste',
      email: 'teste@teste.com',
      cpf: '25634428777',
   };

   const salvarPedidoRequest = {
      clienteId: 1,
      dataInicio: '2023-06-24',
      estadoPedido: EstadoPedido.PAGAMENTO_PENDENTE,
      ativo: true,
   };

   beforeEach(() => {
      salvarItemPedidoRequest = {
         pedidoId: 1,
         produtoId: 1,
         quantidade: 1,
      };

      itemPedido = {
         id: 1,
         pedidoId: 1,
         produtoId: 1,
         quantidade: 1,
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

      // Criar cliente e Pedido
      //TODO: remover quando reutilizar TestingModule entre os testes
      if (process.env.NODE_ENV === 'local-mock-repository') {
         await request(app.getHttpServer())
            .post('/v1/cliente')
            .set('Content-type', 'application/json')
            .send(salvarClienteRequest);

         await request(app.getHttpServer())
            .post('/v1/pedido')
            .set('Content-type', 'application/json')
            .send(salvarPedidoRequest);
      }
   });

   afterAll(async () => {
      await app.close();
   });

   it('POST /v1/item - Deve adicionar um novo item ao pedido e retornar o ID', async () => {
      // realiza requisição e compara a resposta
      return await request(app.getHttpServer())
         .post('/v1/item')
         .set('Content-type', 'application/json')
         .send(salvarItemPedidoRequest)
         .then((response) => {
            expect(response.status).toEqual(201);
            expect(response.body).toEqual(itemPedido);
            expect(response.body).toHaveProperty('id');
            expect(response.body.pedidoId).toEqual(salvarItemPedidoRequest.pedidoId);
         });
   });
});
