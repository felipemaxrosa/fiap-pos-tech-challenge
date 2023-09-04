import * as request from 'supertest';
import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Produto } from 'src/enterprise/produto/model/produto.model';
import { CamposObrigatoriosProdutoValidator } from 'src/application/produto/validation/campos-obrigatorios-produto.validator';
import { MainModule } from 'src/main.module';
import { EditarProdutoRequest } from 'src/presentation/rest/produto/request/editar-produto.request';
import { SalvarProdutoRequest } from 'src/presentation/rest/produto/request/salvar-produto.request';

describe('ProdutoRestApi (e2e)', () => {
   let app: INestApplication;
   let salvarProdutoRequest: SalvarProdutoRequest;
   let editarProdutoRequest: EditarProdutoRequest;
   let produto: Produto;

   const IMAGEM_BASE64_SAMPLE =
      'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABAQMAAAAl21bKAAAAA1BMVEUAAACnej3aAAAAAXRSTlMAQObYZgAAAApJREFUCNdjYAAAAAIAAeIhvDMAAAAASUVORK5CYII=';

   const IMAGEM_BASE64_ANOTHER_SAMPLE =
      'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQEASABIAAD//gATQ3JlYXRlZCB3aXRoIEdJTVD/2wBDAAEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQH/2wBDAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQH/wAARCAABAAEDAREAAhEBAxEB/8QAFAABAAAAAAAAAAAAAAAAAAAAC//EABQQAQAAAAAAAAAAAAAAAAAAAAD/xAAUAQEAAAAAAAAAAAAAAAAAAAAA/8QAFBEBAAAAAAAAAAAAAAAAAAAAAP/aAAwDAQACEQMRAD8AP/B//9k=';

   beforeEach(() => {
      // Define objeto de requisição para salvar request
      salvarProdutoRequest = {
         nome: 'nome correto',
         idCategoriaProduto: 1,
         descricao: 'Teste',
         preco: 10,
         imagemBase64: IMAGEM_BASE64_SAMPLE,
         ativo: true,
      };

      // Define objeto de requisição para editar request
      editarProdutoRequest = {
         id: 1,
         nome: 'nome editado',
         idCategoriaProduto: 2,
         descricao: 'Teste editado',
         preco: 101,
         imagemBase64: IMAGEM_BASE64_ANOTHER_SAMPLE,
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
            expect(response.body).toHaveProperty('id');
            expect(response.body).toEqual(produto);
            expect(response.body.nome).toEqual(salvarProdutoRequest.nome);
            expect(response.body.idCategoriaProduto).toEqual(salvarProdutoRequest.idCategoriaProduto);
            expect(response.body.descricao).toEqual(salvarProdutoRequest.descricao);
            expect(response.body.preco).toEqual(salvarProdutoRequest.preco);
            expect(response.body.imagemBase64).toEqual(salvarProdutoRequest.imagemBase64);
            expect(response.body.ativo).toEqual(salvarProdutoRequest.ativo);
         });
   });

   it('POST /v1/produto - Não deve cadastrar um produto sem o request', async () => {
      // realiza requisição e compara a resposta de erro
      return await request(app.getHttpServer())
         .post('/v1/produto')
         .set('Content-type', 'application/json')
         .send({})
         .then((response) => {
            expect(response.status).toEqual(400);
            expect(response.body.message).toEqual([
               'Nome deve ser válido',
               'Id da categoria deve ser válido',
               'Descrição deve ser válida',
               'Preço não pode ser vazio',
            ]);
            expect(response.body).toHaveProperty('path');
            expect(response.body).toHaveProperty('timestamp');
         });
   });

   it('POST /v1/produto - Não deve cadastrar um produto com idCategoriaProduto inválido', async () => {
      // realiza requisição e compara a resposta de erro
      const salvarProdutoRequestInvalido = { ...salvarProdutoRequest, idCategoriaProduto: 0 };
      return await request(app.getHttpServer())
         .post('/v1/produto')
         .set('Content-type', 'application/json')
         .send(salvarProdutoRequestInvalido)
         .then((response) => {
            expect(response.status).toEqual(400);
            expect(response.body.message).toEqual(CamposObrigatoriosProdutoValidator.CAMPOS_INVALIDOS_ERROR_MESSAGE);
            expect(response.body).toHaveProperty('path');
            expect(response.body).toHaveProperty('timestamp');
         });
   });

   it('DELETE /v1/produto/1 - deve deletar um produto', async () => {
      // realiza requisição e compara a resposta de erro
      return await request(app.getHttpServer())
         .delete('/v1/produto/1')
         .set('Content-type', 'application/json')
         .then((response) => {
            expect(response.status).toEqual(200);
         });
   });

   it('PUT /v1/produto/1 - deve editar um produto', async () => {
      // realiza requisição e compara a resposta de erro
      return await request(app.getHttpServer())
         .put('/v1/produto/1')
         .set('Content-type', 'application/json')
         .send(editarProdutoRequest)
         .then((response) => {
            expect(response.status).toEqual(200);
            expect(response.body).toHaveProperty('id');
            expect(response.body.nome).toEqual(editarProdutoRequest.nome);
            expect(response.body.idCategoriaProduto).toEqual(editarProdutoRequest.idCategoriaProduto);
            expect(response.body.descricao).toEqual(editarProdutoRequest.descricao);
            expect(response.body.preco).toEqual(editarProdutoRequest.preco);
            expect(response.body.imagemBase64).toEqual(editarProdutoRequest.imagemBase64);
            expect(response.body.ativo).toEqual(editarProdutoRequest.ativo);
         });
   });

   it('GET /v1/produto/1 - deve retornar um produto existente', async () => {
      // realiza requisição e compara a resposta
      return await request(app.getHttpServer())
         .get('/v1/produto/1')
         .set('Content-type', 'application/json')
         .then((response) => {
            expect(response.status).toEqual(200);
            expect(response.body).toHaveProperty('id');
            expect(response.body.nome).toEqual(editarProdutoRequest.nome);
            expect(response.body.idCategoriaProduto).toEqual(editarProdutoRequest.idCategoriaProduto);
            expect(response.body.descricao).toEqual(editarProdutoRequest.descricao);
            expect(response.body.preco).toEqual(editarProdutoRequest.preco);
            expect(response.body.imagemBase64).toEqual(editarProdutoRequest.imagemBase64);
            expect(response.body.ativo).toEqual(editarProdutoRequest.ativo);
         });
   });

   it('GET /v1/produto/1000 - deve retornar 404 quando buscar um produto inexistente', async () => {
      // realiza requisição e compara a resposta
      return await request(app.getHttpServer())
         .get('/v1/produto/1000')
         .set('Content-type', 'application/json')
         .then((response) => {
            expect(response.status).toEqual(404);
         });
   });

   it('GET /v1/produto/categoria/2 - deve retornar produtos para categoria 2', async () => {
      // realiza requisição e compara a resposta
      return await request(app.getHttpServer())
         .get('/v1/produto/categoria/2')
         .set('Content-type', 'application/json')
         .then((response) => {
            expect(response.status).toEqual(200);
            expect(Array.isArray(response.body)).toBeTruthy();
            const produtosEncontrados = <Produto[]>JSON.parse(JSON.stringify(response.body));
            expect(produtosEncontrados.length).toEqual(1);
            expect(produtosEncontrados[0].id).toEqual(editarProdutoRequest.id);
            expect(produtosEncontrados[0].nome).toEqual(editarProdutoRequest.nome);
            expect(produtosEncontrados[0].idCategoriaProduto).toEqual(editarProdutoRequest.idCategoriaProduto);
            expect(produtosEncontrados[0].descricao).toEqual(editarProdutoRequest.descricao);
            expect(produtosEncontrados[0].preco).toEqual(editarProdutoRequest.preco);
            expect(produtosEncontrados[0].imagemBase64).toEqual(editarProdutoRequest.imagemBase64);
            expect(produtosEncontrados[0].ativo).toEqual(editarProdutoRequest.ativo);
         });
   });

   it('GET /v1/produto/categoria/1 - deve retornar 404 quando não houver produtos para a categoria', async () => {
      // realiza requisição e compara a resposta
      return await request(app.getHttpServer())
         .get('/v1/produto/categoria/1')
         .set('Content-type', 'application/json')
         .then((response) => {
            expect(response.status).toEqual(404);
         });
   });
});
