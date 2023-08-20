import { Test, TestingModule } from '@nestjs/testing';
import { PagamentoController } from 'src/presentation/web/pagamento/controller/pagamento.controller';

describe('PagamentoController', () => {
   let controller: PagamentoController;

   beforeEach(async () => {
      // Configuração do módulo de teste
      const module: TestingModule = await Test.createTestingModule({
         controllers: [PagamentoController],
      }).compile();

      // Desabilita a saída de log
      module.useLogger(false);

      // Obtém a instância do controller a partir do módulo de teste
      controller = module.get<PagamentoController>(PagamentoController);
   });

   describe('efetuar pagamento', () => {
      it('o pagamento deve ser realizado com sucesso', async () => {
         const result = await controller.pagar(1);

         // Verifica se o resultado obtido é igual ao esperado
         expect(result).toBeTruthy();
      }); // end it 'o pagamento deve ser realizado com sucesso'
   });
});
