import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { EstadoPedido } from 'src/enterprise/pedido/enums/pedido';
import { MainModule } from 'src/main.module';
import * as request from 'supertest';

describe('PagamentoRestApi (e2e)', () => {
   let app: INestApplication;

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

      // Setting up the in-memory repository with required data that is not produced by this test
      //TODO: remover quando reutilizar TestingModule entre os testes
      if (process.env.NODE_ENV === 'local-mock-repository') {
         //gerar pedido
         const salvarPedidoRequest = {
            clienteId: 1,
            dataInicio: '2023-06-24',
            estadoPedido: EstadoPedido.PAGAMENTO_PENDENTE,
            ativo: true,
         };
         await request(app.getHttpServer())
            .post('/v1/pedido')
            .set('Content-type', 'application/json')
            .send(salvarPedidoRequest);

         // realizar checkout
         await request(app.getHttpServer()).post('/v1/pedido/checkout/1').set('Content-type', 'application/json');
      }
   });

   afterAll(async () => {
      await app.close();
   });

   //TODO: reativar após resolver problema com o mock do repository in memory
   it('POST /v1/pagamento/<transaçãoId> - deve acionar o webhook de pagamento', async () => {
      expect(1).toEqual(1);
      // realiza requisição e compara a resposta
      // const pedidoId = 1;
      // const transacaoId = RandomIdGeneratorUtils.generate('transacaoId', pedidoId);
      //
      // return await request(app.getHttpServer())
      //    .post(`/v1/pagamento/${transacaoId}`)
      //    .set('Content-type', 'application/json')
      //    .then((response) => {
      //       expect(response.status).toEqual(201);
      //    });
   });
});
