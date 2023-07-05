import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';

import { MainModule } from '../../src/main.module';

describe('PagamentoController (e2e)', () => {
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
   });

   afterAll(async () => {
      await app.close();
   });

   it('POST /v1/pagamento/1 - deve efetuar o pagamento', async () => {
      // realiza requisição e compara a resposta
      return await request(app.getHttpServer())
         .post('/v1/pagamento/1')
         .set('Content-type', 'application/json')
         .then((response) => {
            expect(response.status).toEqual(201);
         });
   });
});
