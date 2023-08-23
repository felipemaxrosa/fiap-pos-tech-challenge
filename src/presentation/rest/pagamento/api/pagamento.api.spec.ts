import { Test, TestingModule } from '@nestjs/testing';
import { PagamentoRestApi } from 'src/presentation/rest/pagamento/api/pagamento.api';

describe('PagamentoRestApi', () => {
   let restApi: PagamentoRestApi;

   beforeEach(async () => {
      // Configuração do módulo de teste
      const module: TestingModule = await Test.createTestingModule({
         controllers: [PagamentoRestApi],
      }).compile();

      // Desabilita a saída de log
      module.useLogger(false);

      // Obtém a instância do restApi a partir do módulo de teste
      restApi = module.get<PagamentoRestApi>(PagamentoRestApi);
   });

   describe('efetuar pagamento', () => {
      it('o pagamento deve ser realizado com sucesso', async () => {
         const result = await restApi.pagar(1);

         // Verifica se o resultado obtido é igual ao esperado
         expect(result).toBeTruthy();
      }); // end it 'o pagamento deve ser realizado com sucesso'
   });
});
