import { Test, TestingModule } from '@nestjs/testing';
import { ProdutoExistentePedidoValidator } from './produto-existente.validator';
import { IRepository } from 'src/enterprise/repository/repository';
import { Produto } from 'src/enterprise/produto/model/produto.model';
import { ValidationException } from 'src/enterprise/exception/validation.exception';
import { ProdutoConstants } from 'src/shared/constants';
import { ItemPedido } from 'src/enterprise/item-pedido/model';

describe('ProdutoExistentePedidoValidator', () => {
   let validator: ProdutoExistentePedidoValidator;
   let repository: IRepository<Produto>;

   const produto: Produto = {
      id: 1,
      nome: 'nome correto',
      idCategoriaProduto: 1,
      descricao: 'Teste',
      preco: 10,
      imagemBase64: '',
      ativo: true,
   };

   const itemPedido: ItemPedido = {
      pedidoId: 1,
      produtoId: 2,
      quantidade: 3,
      id: 123,
   };

   beforeEach(async () => {
      const module: TestingModule = await Test.createTestingModule({
         providers: [
            ProdutoExistentePedidoValidator,
            {
               provide: ProdutoConstants.IREPOSITORY,
               useValue: {
                  findBy: jest.fn(() => {
                     return Promise.resolve([produto]);
                  }),
               },
            },
         ],
      }).compile();

      module.useLogger(false);

      repository = module.get<IRepository<Produto>>(ProdutoConstants.IREPOSITORY);
      validator = module.get<ProdutoExistentePedidoValidator>(ProdutoExistentePedidoValidator);
   });

   describe('injeção de dependências', () => {
      it('deve existir instância de repositório definida', async () => {
         expect(repository).toBeDefined();
      });
   });

   describe('validate', () => {
      it('deve validar pedido quando existir um produto', async () => {
         const result = await validator.validate(itemPedido);

         expect(result).toBeTruthy();
      });

      it('não deve validar pedido quando não existir um pedido', async () => {
         repository.findBy = jest.fn().mockImplementation(() => Promise.resolve([]));

         await expect(validator.validate(itemPedido)).rejects.toThrowError(ValidationException);
      });
   });
});
