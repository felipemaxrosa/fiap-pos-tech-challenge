import * as request from 'supertest';
import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Cliente } from 'src/enterprise/cliente/model/cliente.model';
import { CpfUnicoClienteValidator } from 'src/application/cliente/validation/cpf-unico-cliente.validator';
import { CpfValidoClienteValidator } from 'src/application/cliente/validation/cpf-valido-cliente.validator';
import { EmailUnicoClienteValidator } from 'src/application/cliente/validation/email-unico-cliente.validator';
import { EmailValidoClienteValidator } from 'src/application/cliente/validation/email-valido-cliente.validator';
import { MainModule } from 'src/main.module';
import { SalvarClienteRequest } from 'src/presentation/rest/cliente/request/salvar-cliente.request';

describe('ClienteRestApi (e2e)', () => {
   let app: INestApplication;
   let salvarClienteRequest: SalvarClienteRequest;
   let salvarClienteResponse: Cliente;

   beforeEach(() => {
      // Define um objeto de requisição
      salvarClienteRequest = {
         nome: 'Teste',
         email: 'teste@teste.com',
         cpf: '25634428777',
      };

      // Define um objeto de cliente esperado como resultado
      salvarClienteResponse = {
         id: 1,
         nome: 'Teste',
         email: 'teste@teste.com',
         cpf: '25634428777',
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

   it('POST /v1/cliente - Deve cadastrar um cliente e retornar o ID', async () => {
      // realiza requisição e compara a resposta
      return await request(app.getHttpServer())
         .post('/v1/cliente')
         .set('Content-type', 'application/json')
         .send(salvarClienteRequest)
         .then((response) => {
            expect(response.status).toEqual(201);
            expect(response.body).toEqual(salvarClienteResponse);
            expect(response.body).toHaveProperty('id');
            expect(response.body.nome).toEqual(salvarClienteRequest.nome);
            expect(response.body.email).toEqual(salvarClienteRequest.email);
            expect(response.body.cpf).toEqual(salvarClienteRequest.cpf);
         });
   });

   it('POST /v1/cliente - Não deve cadastrar um cliente sem o request', async () => {
      // realiza requisição e compara a resposta de erro
      return await request(app.getHttpServer())
         .post('/v1/cliente')
         .set('Content-type', 'application/json')
         .send({})
         .catch((response) => {
            expect(response.status).toEqual(400);
            expect(response.body.message).toEqual([
               'Nome deve ser válido',
               'Email deve ser válido',
               'CPF deve ser válido',
            ]);
            expect(response.body).toHaveProperty('path');
            expect(response.body).toHaveProperty('timestamp');
         });
   });

   it('POST /v1/cliente - Não deve cadastrar um cliente com email existente', async () => {
      // realiza requisição e compara a resposta de erro
      return await request(app.getHttpServer())
         .post('/v1/cliente')
         .set('Content-type', 'application/json')
         .send(salvarClienteRequest)
         .then((response) => {
            expect(response.status).toEqual(400);
            expect(response.body.message).toEqual(
               EmailUnicoClienteValidator.EMAIL_UNICO_CLIENTE_VALIDATOR_ERROR_MESSAGE,
            );
            expect(response.body).toHaveProperty('path');
            expect(response.body).toHaveProperty('timestamp');
         });
   });

   it('POST /v1/cliente - Não deve cadastrar um cliente com cpf existente', async () => {
      // Altera o email para um novo, não cadastrado
      salvarClienteRequest.email = 'novo@email.com';

      // realiza requisição e compara a resposta de erro
      return await request(app.getHttpServer())
         .post('/v1/cliente')
         .set('Content-type', 'application/json')
         .send(salvarClienteRequest)
         .then((response) => {
            expect(response.status).toEqual(400);
            expect(response.body.message).toEqual(CpfUnicoClienteValidator.CPF_UNICO_CLIENTE_VALIDATOR_ERROR_MESSAGE);
            expect(response.body).toHaveProperty('path');
            expect(response.body).toHaveProperty('timestamp');
         });
   });

   it('POST /v1/cliente - Não deve cadastrar um cliente sem nome', async () => {
      salvarClienteRequest.nome = undefined;

      return await request(app.getHttpServer())
         .post('/v1/cliente')
         .set('Content-type', 'application/json')
         .send(salvarClienteRequest)
         .catch((response) => {
            expect(response.status).toEqual(400);
            expect(response.body.message).toEqual(['Nome deve ser válido']);
            expect(response.body).toHaveProperty('path');
            expect(response.body).toHaveProperty('timestamp');
         });
   });

   it('POST /v1/cliente - Não deve cadastrar um cliente sem email', async () => {
      salvarClienteRequest.email = undefined;

      // realiza requisição e compara a resposta de erro
      return await request(app.getHttpServer())
         .post('/v1/cliente')
         .set('Content-type', 'application/json')
         .send(salvarClienteRequest)
         .catch((response) => {
            expect(response.status).toEqual(400);
            expect(response.body.message).toEqual(['Email deve ser válido']);
            expect(response.body).toHaveProperty('path');
            expect(response.body).toHaveProperty('timestamp');
         });
   });

   it('POST /v1/cliente - Não deve cadastrar um cliente sem cpf', async () => {
      salvarClienteRequest.cpf = undefined;

      // realiza requisição e compara a resposta de erro
      return await request(app.getHttpServer())
         .post('/v1/cliente')
         .set('Content-type', 'application/json')
         .send(salvarClienteRequest)
         .catch((response) => {
            expect(response.status).toEqual(400);
            expect(response.body.message).toEqual(['CPF deve ser válido']);
            expect(response.body).toHaveProperty('path');
            expect(response.body).toHaveProperty('timestamp');
         });
   });

   it('POST /v1/cliente - Não deve cadastrar um cliente com cpf inválido', async () => {
      salvarClienteRequest.cpf = '12345678901';

      // realiza requisição e compara a resposta de erro
      return await request(app.getHttpServer())
         .post('/v1/cliente')
         .set('Content-type', 'application/json')
         .send(salvarClienteRequest)
         .catch((response) => {
            expect(response.status).toEqual(400);
            expect(response.body.message).toEqual(CpfValidoClienteValidator.CPF_VALIDO_CLIENTE_VALIDATOR_ERROR_MESSAGE);
            expect(response.body).toHaveProperty('path');
            expect(response.body).toHaveProperty('timestamp');
         });
   });

   it('POST /v1/cliente - Não deve cadastrar um cliente com email inválido', async () => {
      salvarClienteRequest.email = 'emailinvalido';

      // realiza requisição e compara a resposta de erro
      return await request(app.getHttpServer())
         .post('/v1/cliente')
         .set('Content-type', 'application/json')
         .send(salvarClienteRequest)
         .catch((response) => {
            expect(response.status).toEqual(400);
            expect(response.body.message).toEqual(
               EmailValidoClienteValidator.EMAIL_VALIDO_CLIENTE_VALIDATOR_ERROR_MESSAGE,
            );
            expect(response.body).toHaveProperty('path');
            expect(response.body).toHaveProperty('timestamp');
         });
   });

   it('POST /v1/cliente - Não deve cadastrar um cliente com email inválido', async () => {
      salvarClienteRequest.email = 'emailinvalido';

      // realiza requisição e compara a resposta de erro
      return await request(app.getHttpServer())
         .post('/v1/cliente')
         .set('Content-type', 'application/json')
         .send(salvarClienteRequest)
         .catch((response) => {
            expect(response.status).toEqual(400);
            expect(response.body.message).toEqual('Email deve ser válido');
            expect(response.body).toHaveProperty('path');
            expect(response.body).toHaveProperty('timestamp');
         });
   });

   it('POST /v1/cliente - Não deve cadastrar um cliente com nome maior do que 255 caracteres', async () => {
      salvarClienteRequest.nome = Array.from({ length: 256 }, () => 'x').join('');

      // realiza requisição e compara a resposta de erro
      return await request(app.getHttpServer())
         .post('/v1/cliente')
         .set('Content-type', 'application/json')
         .send(salvarClienteRequest)
         .catch((response) => {
            expect(response.status).toEqual(400);
            expect(response.body.message).toEqual(['O nome deve ter no máximo 255 caracteres']);
            expect(response.body).toHaveProperty('path');
            expect(response.body).toHaveProperty('timestamp');
         });
   });

   it('POST /v1/cliente - Não deve cadastrar um cliente com email maior do que 255 caracteres', async () => {
      salvarClienteRequest.email = Array.from({ length: 256 }, () => 'x').join('');

      // realiza requisição e compara a resposta de erro
      return await request(app.getHttpServer())
         .post('/v1/cliente')
         .set('Content-type', 'application/json')
         .send(salvarClienteRequest)
         .catch((response) => {
            expect(response.status).toEqual(400);
            expect(response.body.message).toEqual(['O email deve ter no máximo 255 caracteres']);
            expect(response.body).toHaveProperty('path');
            expect(response.body).toHaveProperty('timestamp');
         });
   });

   it('POST /v1/cliente/identifica?cpf - Deve identificar cliente por cpf', async () => {
      // realiza requisição e compara a resposta de erro
      return await request(app.getHttpServer())
         .post(`/v1/cliente/identifica?cpf=${salvarClienteRequest.cpf}`)
         .then((response) => {
            expect(response.status).toEqual(200);
            expect(response.body).toEqual(salvarClienteResponse);
         });
   });

   it('POST /v1/cliente/identifica?cpf - Deve identificar cliente anônimo com cpf inexistente', async () => {
      // realiza requisição e compara a resposta de erro
      return await request(app.getHttpServer())
         .post(`/v1/cliente/identifica?cpf=00000000191`)
         .then((response) => {
            expect(response.status).toEqual(200);
            expect(response.body.anonimo).toEqual(true);
         });
   });

   it('POST /v1/cliente/identifica?cpf - Não deve identificar cliente por cpf inválido', async () => {
      // realiza requisição e compara a resposta de erro
      return await request(app.getHttpServer())
         .post(`/v1/cliente?cpf=00000000000`)
         .catch((response) => {
            expect(response.status).toEqual(400);
            expect(response.body.message).toEqual(CpfValidoClienteValidator.CPF_VALIDO_CLIENTE_VALIDATOR_ERROR_MESSAGE);
            expect(response.body).toHaveProperty('path');
            expect(response.body).toHaveProperty('timestamp');
         });
   });

   it('POST /v1/cliente - Não deve cadastrar um cliente com cpf maior do que 11 caracteres', async () => {
      salvarClienteRequest.cpf = '123456789012';

      // realiza requisição e compara a resposta de erro
      return await request(app.getHttpServer())
         .post('/v1/cliente')
         .set('Content-type', 'application/json')
         .send(salvarClienteRequest)
         .catch((response) => {
            expect(response.status).toEqual(400);
            expect(response.body.message).toEqual(['O cpf deve ter no máximo 11 caracteres']);
            expect(response.body).toHaveProperty('path');
            expect(response.body).toHaveProperty('timestamp');
         });
   });

   it('GET /v1/cliente?cpf - Deve consultar cliente por cpf', async () => {
      // realiza requisição e compara a resposta de erro
      return await request(app.getHttpServer())
         .get(`/v1/cliente?cpf=${salvarClienteResponse.cpf}`)
         .then((response) => {
            expect(response.status).toEqual(200);
            expect(response.body).toEqual(salvarClienteResponse);
         });
   });

   it('GET /v1/cliente?cpf - Não deve consultar cliente por cpf inexistente', async () => {
      // realiza requisição e compara a resposta de erro
      return await request(app.getHttpServer())
         .get(`/v1/cliente?cpf=00000000191`)
         .then((response) => {
            expect(response.status).toEqual(404);
            expect(response.body.message).toEqual('Cliente não encontrado');
         });
   });

   it('GET /v1/cliente?cpf - Não deve consultar cliente por cpf inválido', async () => {
      // realiza requisição e compara a resposta de erro
      return await request(app.getHttpServer())
         .get(`/v1/cliente?cpf=12345678901`)
         .then((response) => {
            expect(response.status).toEqual(400);
            expect(response.body.message).toEqual(CpfValidoClienteValidator.CPF_VALIDO_CLIENTE_VALIDATOR_ERROR_MESSAGE);
         });
   });

   it('GET /v1/cliente?cpf - Não deve consultar cliente por cpf vazio', async () => {
      // realiza requisição e compara a resposta de erro
      return await request(app.getHttpServer())
         .get(`/v1/cliente?cpf=`)
         .then((response) => {
            expect(response.status).toEqual(400);
            expect(response.body.message).toEqual(['CPF deve ser válido']);
         });
   });
});
