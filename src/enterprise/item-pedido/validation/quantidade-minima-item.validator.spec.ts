import { Test, TestingModule } from '@nestjs/testing';
import { ItemPedido } from 'src/enterprise/item-pedido/model';
import { QuantidadeMinimaItemValidator } from 'src/enterprise/item-pedido/validation/quantidade-minima-item.validator';
import { IRepository } from 'src/enterprise/repository/repository';
import { ItemPedidoConstants } from 'src/shared/constants';

describe('QuantidadeMinimaItemValidator', () => {
   let validator: QuantidadeMinimaItemValidator;
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
            QuantidadeMinimaItemValidator,
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
      validator = module.get<QuantidadeMinimaItemValidator>(QuantidadeMinimaItemValidator);
   });

   describe('injeção de dependências', () => {
      it('deve existir instância de repositório definida', async () => {
         expect(repository).toBeDefined();
      });
   });

   describe('validate', () => {
      it('deve validar quantidade minima do item', async () => {
         await validator.validate(criarNovoItem()).then((itemAdicionado) => {
            expect(itemAdicionado).toBeTruthy();
         });
      });

      it('deve disparar um ERRO devido a quantidade minima ser menor que 1', async () => {
         const itemComQuantidadeZero = criarNovoItem({ quantidade: 0 });

         await expect(validator.validate(itemComQuantidadeZero)).rejects.toThrowError(
            QuantidadeMinimaItemValidator.ERROR_MESSAGE,
         );
      });
   });
});
