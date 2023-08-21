import * as request from 'supertest';
import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { CategoriaProduto } from 'src/enterprise/categoria/model/categoria-produto.model';
import { MainModule } from 'src/main.module';

describe('CategoriaProdutoController (e2e)', () => {
   let app: INestApplication;

   const categoriaProdutos: Array<CategoriaProduto> = [
      { id: 1, nome: 'Lanche' },
      { id: 2, nome: 'Acompanhamento' },
      { id: 3, nome: 'Bebida' },
      { id: 4, nome: 'Sobremesa' },
   ];

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

   it('GET /v1/categoria - deve listar as categorias existentes', async () => {
      // realiza requisição e compara a resposta
      return await request(app.getHttpServer())
         .get('/v1/categoria')
         .set('Content-type', 'application/json')
         .then((response) => {
            expect(response.status).toEqual(200);
            expect(response.body).toHaveLength(categoriaProdutos.length);
            const categoriasProdutosEncontrados = <CategoriaProduto[]>JSON.parse(JSON.stringify(response.body));
            categoriasProdutosEncontrados.forEach((categoriaProduto) => {
               expect(categoriaProdutos).toContainEqual(categoriaProduto);
            });
         });
   });
});
