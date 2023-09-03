import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { MainModule } from 'src/main.module';
import { RandomIdGeneratorUtils } from 'src/shared/random.id.generator.utils';
import * as request from 'supertest';

describe('PagamentoRestApi (e2e)', () => {
   let app: INestApplication;

   beforeAll(async () => {
      // Configuração do módulo de teste
      const module: TestingModule = await Test.createTestingModule({
         imports: [MainModule],
      }).compile();

      // Desabilita a saída de log
      //module.useLogger(false);

      app = module.createNestApplication();

      // Configuração de validações global inputs request
      app.useGlobalPipes(new ValidationPipe({ stopAtFirstError: true }));
      await app.init();
   });

   afterAll(async () => {
      await app.close();
   });

   it('POST /v1/pagamento/<transaçãoId> - deve acionar o webhook de pagamento', async () => {
      // realiza requisição e compara a resposta
      const pedidoId = 1;
      const transacaoId = RandomIdGeneratorUtils.generate('transacaoId', pedidoId);

      return await request(app.getHttpServer())
         .post(`/v1/pagamento/${transacaoId}`)
         .set('Content-type', 'application/json')
         .then((response) => {
            expect(response.status).toEqual(201);
         });
   });
});
