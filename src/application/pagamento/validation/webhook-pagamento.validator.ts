import { Pagamento } from 'src/enterprise/pagamento/model/pagamento.model';
import { IValidator } from 'src/enterprise/validation/validator';

export type WebhookPagamentoValidator = IValidator<Pagamento>;
