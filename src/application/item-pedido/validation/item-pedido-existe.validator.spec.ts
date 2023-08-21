import { Test, TestingModule } from '@nestjs/testing';
import { ItemPedido } from 'src/enterprise/item-pedido/model';
import { ItemPedidoExistenteValidator } from 'src/application/item-pedido/validation/item-pedido-existe.validator';
import { IRepository } from 'src/enterprise/repository/repository';
import { ItemPedidoConstants } from 'src/shared/constants';

describe('ItemPedidoExistenteValidator', () => {
   let validator: ItemPedidoExistenteValidator;
   let repository: IRepository<ItemPedido>;

   const { IREPOSITORY } = ItemPedidoConstants;

   const itemPedidoPadrao: ItemPedido = {
      id: 1,
      pedidoId: 1,
      produtoId: 1,
      quantidade: 1,
   };

   const criarNovoItem = (props?: Partial<ItemPedido>): ItemPedido => {
      return {
         ...itemPedidoPadrao,
         ...props,
      };
   };

   beforeEach(async () => {
      // Configuração do módulo de teste
      const module: TestingModule = await Test.createTestingModule({
         providers: [
            ItemPedidoExistenteValidator,
            // Mock do serviço IRepository<Pedido>
            {
               provide: IREPOSITORY,
               useValue: {
                  findBy: jest.fn(() => {
                     // retorna vazio, sumulando que não encontrou registros pelo atributos passados por parâmetro
                     return Promise.resolve({});
                  }),
               },
            },
         ],
      }).compile();

      // Desabilita a saída de log
      module.useLogger(false);

      // Obtém a instância do serviço e repositório a partir do módulo de teste
      repository = module.get<IRepository<ItemPedido>>(IREPOSITORY);
      validator = module.get<ItemPedidoExistenteValidator>(ItemPedidoExistenteValidator);
   });

   describe('injeção de dependências', () => {
      it('deve existir instância de repositório definida', async () => {
         expect(repository).toBeDefined();
      });
   });

   describe('validate', () => {
      it('deve validar se item existe', async () => {
         jest.spyOn(repository, 'findBy').mockResolvedValue([itemPedidoPadrao]);

         await validator.validate(criarNovoItem()).then((itemAdicionado) => {
            expect(itemAdicionado).toBeTruthy();
         });
      });

      it('deve disparar um ERRO devido ao ID do item nao existir', async () => {
         const itemComIdInexistente = criarNovoItem({ id: 0 });

         await expect(validator.validate(itemComIdInexistente)).rejects.toThrowError(
            ItemPedidoExistenteValidator.ERROR_MESSAGE,
         );
      });
   });
});
