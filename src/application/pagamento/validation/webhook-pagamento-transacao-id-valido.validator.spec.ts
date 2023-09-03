import { Test, TestingModule } from '@nestjs/testing';
import { ValidationException } from 'src/enterprise/exception/validation.exception';
import { Pagamento } from 'src/enterprise/pagamento/model/pagamento.model';
import { IRepository } from 'src/enterprise/repository/repository';
import { PagamentoConstants } from 'src/shared/constants';
import { WebhookPagamentoTransacaoIdValidoValidator } from './webhook-pagamento-transacao-id-valido.validator';

describe('WebhookPagamentoTransacaoIdValidoValidator', () => {
   let repository: IRepository<Pagamento>;
   let validator: WebhookPagamentoTransacaoIdValidoValidator;

   beforeEach(async () => {
      const module: TestingModule = await Test.createTestingModule({
         providers: [
            WebhookPagamentoTransacaoIdValidoValidator,
            {
               provide: PagamentoConstants.IREPOSITORY,
               useValue: {
                  findBy: jest.fn(() => {
                     return Promise.resolve([]);
                  }),
               },
            },
         ],
      }).compile();

      validator = module.get<WebhookPagamentoTransacaoIdValidoValidator>(WebhookPagamentoTransacaoIdValidoValidator);
      repository = module.get<IRepository<Pagamento>>(PagamentoConstants.IREPOSITORY);
   });

   it('should be defined', () => {
      expect(repository).toBeDefined();
      expect(validator).toBeDefined();
   });

   it('should validate a valid transacaoId', async () => {
      const pagamento: Pagamento = { transacaoId: 'existingTransacaoId' } as Pagamento;
      jest.spyOn(repository, 'findBy').mockResolvedValue([{ transacaoId: 'existingTransacaoId' } as Pagamento]);
      const result = await validator.validate(pagamento);
      expect(result).toBeTruthy();
   });

   it('should throw ValidationException for an invalid transacaoId', async () => {
      jest.spyOn(repository, 'findBy').mockResolvedValue([]);
      const pagamento: Pagamento = { transacaoId: 'nonExistingTransacaoId' } as Pagamento;
      try {
         await validator.validate(pagamento);
      } catch (error) {
         expect(error).toBeInstanceOf(ValidationException);
         expect(error.message).toBe(WebhookPagamentoTransacaoIdValidoValidator.TRANSACAO_INEXISTENTE_ERROR_MESSAGE);
      }
   });
});
