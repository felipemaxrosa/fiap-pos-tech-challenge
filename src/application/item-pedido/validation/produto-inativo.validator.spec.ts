import { Test, TestingModule } from '@nestjs/testing';
import { ItemPedido } from 'src/enterprise/item-pedido/model';
import { Produto } from 'src/enterprise/produto/model/produto.model';
import { ValidationException } from 'src/enterprise/exception/validation.exception';
import { IRepository } from 'src/enterprise/repository/repository';
import { ProdutoConstants } from 'src/shared/constants';
import { ProdutoInativoPedidoValidator } from 'src/application/item-pedido/validation/produto-inativo.validator';

const IMAGEM_BASE64_SAMPLE =
   'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABAQMAAAAl21bKAAAAA1BMVEUAAACnej3aAAAAAXRSTlMAQObYZgAAAApJREFUCNdjYAAAAAIAAeIhvDMAAAAASUVORK5CYII=';

describe('ProdutoInativoPedidoValidator', () => {
   let validator: ProdutoInativoPedidoValidator;
   let produtoRepository: IRepository<Produto>;

   const produtoAtivo: Produto = {
      id: 1,
      nome: 'nome correto',
      idCategoriaProduto: 1,
      descricao: 'Teste',
      preco: 10,
      imagemBase64: IMAGEM_BASE64_SAMPLE,
      ativo: true,
   };

   const produtoInativo: Produto = {
      id: 1,
      nome: 'nome correto',
      idCategoriaProduto: 1,
      descricao: 'Teste',
      preco: 10,
      imagemBase64: IMAGEM_BASE64_SAMPLE,
      ativo: false,
   };

   beforeEach(async () => {
      // Configuração do módulo de teste
      const module: TestingModule = await Test.createTestingModule({
         providers: [
            ProdutoInativoPedidoValidator,
            // Mock do repositório de Produto
            {
               provide: ProdutoConstants.IREPOSITORY,
               useValue: {
                  findBy: jest.fn(() => {
                     // Retorna um produto ativo por padrão, mas pode ser alterado nos testes
                     return Promise.resolve([produtoAtivo]);
                  }),
               },
            },
         ],
      }).compile();

      // Obtém a instância do validator e do repositório a partir do módulo de teste
      validator = module.get<ProdutoInativoPedidoValidator>(ProdutoInativoPedidoValidator);
      produtoRepository = module.get<IRepository<Produto>>(ProdutoConstants.IREPOSITORY);
   });

   describe('validate', () => {
      it('deve passar na validação quando o produto está ativo', async () => {
         const itemPedido: ItemPedido = {
            pedidoId: 1,
            produtoId: 1,
            quantidade: 1,
         };

         const isValid = await validator.validate(itemPedido);
         expect(isValid).toBeTruthy();
      });

      it('deve lançar uma exceção de validação quando o produto está inativo', async () => {
         const itemPedido: ItemPedido = {
            pedidoId: 1,
            produtoId: 1,
            quantidade: 1,
         };

         // Mock para retornar um produto inativo
         produtoRepository.findBy = jest.fn(() => {
            return Promise.resolve([produtoInativo]);
         });

         // O validator deve lançar uma exceção de validação
         await expect(validator.validate(itemPedido)).rejects.toThrowError(ValidationException);
      });
   });
});
