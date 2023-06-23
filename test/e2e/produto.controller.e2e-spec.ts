import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';

import { MainModule } from '../../src/main.module';
import { SalvarProdutoRequest } from 'src/application/web/produto/request/salvar-produto.request';
import { Produto } from 'src/domain/produto/model/produto.model';

describe('ProdutoController (e2e)', () => {
   let app: INestApplication;
   let salvarProdutoRequest: SalvarProdutoRequest;
   let produto: Produto;

   const IMAGEM_BASE64_SAMPLE =
      'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABAQMAAAAl21bKAAAAA1BMVEUAAACnej3aAAAAAXRSTlMAQObYZgAAAApJREFUCNdjYAAAAAIAAeIhvDMAAAAASUVORK5CYII=';

   beforeEach(() => {
      // Define um objeto de requisição
      salvarProdutoRequest = {
         nome: 'nome correto',
         idCategoriaProduto: 1,
         descricao: 'Teste',
         preco: 10,
         imagemBase64: IMAGEM_BASE64_SAMPLE,
         ativo: true,
      };
      // Define um objeto de produto esperado como resultado
      produto = {
         id: 1,
         nome: 'nome correto',
         idCategoriaProduto: 1,
         descricao: 'Teste',
         preco: 10,
         imagemBase64: IMAGEM_BASE64_SAMPLE,
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

   it('POST /v1/produto - Deve cadastrar um produto e retornar o ID', async () => {
      // realiza requisição e compara a resposta
      return await request(app.getHttpServer())
         .post('/v1/produto')
         .set('Content-type', 'application/json')
         .send(salvarProdutoRequest)
         .then((response) => {
            expect(response.status).toEqual(201);
            expect(response.body).toEqual(produto);
            expect(response.body).toHaveProperty('id');
            expect(response.body.nome).toEqual(salvarProdutoRequest.nome);
         });
   });
   //
   // it('POST /v1/produto - Não deve cadastrar um produto sem o request', async () => {
   //    // realiza requisição e compara a resposta de erro
   //    return await request(app.getHttpServer())
   //       .post('/v1/produto')
   //       .set('Content-type', 'application/json')
   //       .send({})
   //       .catch((response) => {
   //          expect(response.status).toEqual(400);
   //          expect(response.body.message).toEqual([
   //             'Nome deve ser válido',
   //             'Email deve ser válido',
   //             'Cpf deve ser válido',
   //          ]);
   //          expect(response.body).toHaveProperty('path');
   //          expect(response.body).toHaveProperty('timestamp');
   //       });
   // });
   //
   // it('POST /v1/produto - Não deve cadastrar um produto com email existente', async () => {
   //    // realiza requisição e compara a resposta de erro
   //    return await request(app.getHttpServer())
   //       .post('/v1/produto')
   //       .set('Content-type', 'application/json')
   //       .send(salvarProdutoRequest)
   //       .then((response) => {
   //          expect(response.status).toEqual(400);
   //          expect(response.body.message).toEqual(
   //             EmailUnicoProdutoValidator.EMAIL_UNICO_CLIENTE_VALIDATOR_ERROR_MESSAGE,
   //          );
   //          expect(response.body).toHaveProperty('path');
   //          expect(response.body).toHaveProperty('timestamp');
   //       });
   // });
   //
   // it('POST /v1/produto - Não deve cadastrar um produto com cpf existente', async () => {
   //    // Altera o email para um novo, não cadastrado
   //    salvarProdutoRequest.email = 'novo@email.com';
   //
   //    // realiza requisição e compara a resposta de erro
   //    return await request(app.getHttpServer())
   //       .post('/v1/produto')
   //       .set('Content-type', 'application/json')
   //       .send(salvarProdutoRequest)
   //       .then((response) => {
   //          expect(response.status).toEqual(400);
   //          expect(response.body.message).toEqual(CpfUnicoProdutoValidator.CPF_UNICO_CLIENTE_VALIDATOR_ERROR_MESSAGE);
   //          expect(response.body).toHaveProperty('path');
   //          expect(response.body).toHaveProperty('timestamp');
   //       });
   // });
   //
   // it('POST /v1/produto - Não deve cadastrar um produto sem nome', async () => {
   //    salvarProdutoRequest.nome = undefined;
   //
   //    return await request(app.getHttpServer())
   //       .post('/v1/produto')
   //       .set('Content-type', 'application/json')
   //       .send(salvarProdutoRequest)
   //       .catch((response) => {
   //          expect(response.status).toEqual(400);
   //          expect(response.body.message).toEqual(['Nome deve ser válido']);
   //          expect(response.body).toHaveProperty('path');
   //          expect(response.body).toHaveProperty('timestamp');
   //       });
   // });
   //
   // it('POST /v1/produto - Não deve cadastrar um produto sem email', async () => {
   //    salvarProdutoRequest.email = undefined;
   //
   //    // realiza requisição e compara a resposta de erro
   //    return await request(app.getHttpServer())
   //       .post('/v1/produto')
   //       .set('Content-type', 'application/json')
   //       .send(salvarProdutoRequest)
   //       .catch((response) => {
   //          expect(response.status).toEqual(400);
   //          expect(response.body.message).toEqual(['Email deve ser válido']);
   //          expect(response.body).toHaveProperty('path');
   //          expect(response.body).toHaveProperty('timestamp');
   //       });
   // });
   //
   // it('POST /v1/produto - Não deve cadastrar um produto sem cpf', async () => {
   //    salvarProdutoRequest.cpf = undefined;
   //
   //    // realiza requisição e compara a resposta de erro
   //    return await request(app.getHttpServer())
   //       .post('/v1/produto')
   //       .set('Content-type', 'application/json')
   //       .send(salvarProdutoRequest)
   //       .catch((response) => {
   //          expect(response.status).toEqual(400);
   //          expect(response.body.message).toEqual(['Cpf deve ser válido']);
   //          expect(response.body).toHaveProperty('path');
   //          expect(response.body).toHaveProperty('timestamp');
   //       });
   // });
   //
   // it('POST /v1/produto - Não deve cadastrar um produto com cpf inválido', async () => {
   //    salvarProdutoRequest.cpf = '12345678901';
   //
   //    // realiza requisição e compara a resposta de erro
   //    return await request(app.getHttpServer())
   //       .post('/v1/produto')
   //       .set('Content-type', 'application/json')
   //       .send(salvarProdutoRequest)
   //       .catch((response) => {
   //          expect(response.status).toEqual(400);
   //          expect(response.body.message).toEqual(CpfValidoProdutoValidator.CPF_VALIDO_CLIENTE_VALIDATOR_ERROR_MESSAGE);
   //          expect(response.body).toHaveProperty('path');
   //          expect(response.body).toHaveProperty('timestamp');
   //       });
   // });
   //
   // it('POST /v1/produto - Não deve cadastrar um produto com email inválido', async () => {
   //    salvarProdutoRequest.email = 'emailinvalido';
   //
   //    // realiza requisição e compara a resposta de erro
   //    return await request(app.getHttpServer())
   //       .post('/v1/produto')
   //       .set('Content-type', 'application/json')
   //       .send(salvarProdutoRequest)
   //       .catch((response) => {
   //          expect(response.status).toEqual(400);
   //          expect(response.body.message).toEqual(
   //             EmailValidoProdutoValidator.EMAIL_VALIDO_CLIENTE_VALIDATOR_ERROR_MESSAGE,
   //          );
   //          expect(response.body).toHaveProperty('path');
   //          expect(response.body).toHaveProperty('timestamp');
   //       });
   // });
   //
   // it('POST /v1/produto - Não deve cadastrar um produto com email inválido', async () => {
   //    salvarProdutoRequest.email = 'emailinvalido';
   //
   //    // realiza requisição e compara a resposta de erro
   //    return await request(app.getHttpServer())
   //       .post('/v1/produto')
   //       .set('Content-type', 'application/json')
   //       .send(salvarProdutoRequest)
   //       .catch((response) => {
   //          expect(response.status).toEqual(400);
   //          expect(response.body.message).toEqual('Email deve ser válido');
   //          expect(response.body).toHaveProperty('path');
   //          expect(response.body).toHaveProperty('timestamp');
   //       });
   // });
   //
   // it('POST /v1/produto - Não deve cadastrar um produto com nome maior do que 255 caracteres', async () => {
   //    salvarProdutoRequest.nome = Array.from({ length: 256 }, () => 'x').join('');
   //
   //    // realiza requisição e compara a resposta de erro
   //    return await request(app.getHttpServer())
   //       .post('/v1/produto')
   //       .set('Content-type', 'application/json')
   //       .send(salvarProdutoRequest)
   //       .catch((response) => {
   //          expect(response.status).toEqual(400);
   //          expect(response.body.message).toEqual(['O nome deve ter no máximo 255 caracteres']);
   //          expect(response.body).toHaveProperty('path');
   //          expect(response.body).toHaveProperty('timestamp');
   //       });
   // });
   //
   // it('POST /v1/produto - Não deve cadastrar um produto com email maior do que 255 caracteres', async () => {
   //    salvarProdutoRequest.email = Array.from({ length: 256 }, () => 'x').join('');
   //
   //    // realiza requisição e compara a resposta de erro
   //    return await request(app.getHttpServer())
   //       .post('/v1/produto')
   //       .set('Content-type', 'application/json')
   //       .send(salvarProdutoRequest)
   //       .catch((response) => {
   //          expect(response.status).toEqual(400);
   //          expect(response.body.message).toEqual(['O email deve ter no máximo 255 caracteres']);
   //          expect(response.body).toHaveProperty('path');
   //          expect(response.body).toHaveProperty('timestamp');
   //       });
   // });
   //
   // it('POST /v1/produto - Não deve cadastrar um produto com cpf maior do que 11 caracteres', async () => {
   //    salvarProdutoRequest.cpf = '123456789012';
   //
   //    // realiza requisição e compara a resposta de erro
   //    return await request(app.getHttpServer())
   //       .post('/v1/produto')
   //       .set('Content-type', 'application/json')
   //       .send(salvarProdutoRequest)
   //       .catch((response) => {
   //          expect(response.status).toEqual(400);
   //          expect(response.body.message).toEqual(['O cpf deve ter no máximo 11 caracteres']);
   //          expect(response.body).toHaveProperty('path');
   //          expect(response.body).toHaveProperty('timestamp');
   //       });
   // });
   //
   // it('GET /v1/produto?cpf - Deve consultar produto por cpf', async () => {
   //    // realiza requisição e compara a resposta de erro
   //    return await request(app.getHttpServer())
   //       .get(`/v1/produto?cpf=${produto.cpf}`)
   //       .then((response) => {
   //          expect(response.status).toEqual(200);
   //          expect(response.body).toEqual(produto);
   //       });
   // });
   //
   // it('GET /v1/produto?cpf - Não deve consultar produto por cpf inexistente', async () => {
   //    // realiza requisição e compara a resposta de erro
   //    return await request(app.getHttpServer())
   //       .get(`/v1/produto?cpf=00000000191`)
   //       .then((response) => {
   //          expect(response.status).toEqual(404);
   //          expect(response.body.message).toEqual('Produto não encontrado');
   //       });
   // });
   //
   // it('GET /v1/produto?cpf - Não deve consultar produto por cpf inválido', async () => {
   //    // realiza requisição e compara a resposta de erro
   //    return await request(app.getHttpServer())
   //       .get(`/v1/produto?cpf=12345678901`)
   //       .then((response) => {
   //          expect(response.status).toEqual(400);
   //          expect(response.body.message).toEqual(CpfValidoProdutoValidator.CPF_VALIDO_CLIENTE_VALIDATOR_ERROR_MESSAGE);
   //       });
   // });
   //
   // it('GET /v1/produto?cpf - Não deve consultar produto por cpf vazio', async () => {
   //    // realiza requisição e compara a resposta de erro
   //    return await request(app.getHttpServer())
   //       .get(`/v1/produto?cpf=`)
   //       .then((response) => {
   //          expect(response.status).toEqual(400);
   //          expect(response.body.message).toEqual(CpfValidoProdutoValidator.CPF_VALIDO_CLIENTE_VALIDATOR_ERROR_MESSAGE);
   //       });
   // });
});
