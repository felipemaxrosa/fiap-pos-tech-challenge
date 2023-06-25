import { Pedido } from '../model/pedido.model';
import { IValidator } from 'src/domain/validation/validator';

export type CriarNovoPedidoValidator = IValidator<Pedido>;
