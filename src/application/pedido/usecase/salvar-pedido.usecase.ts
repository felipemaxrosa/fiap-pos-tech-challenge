import { Inject, Injectable, Logger } from '@nestjs/common';
import { ServiceException } from 'src/enterprise/exception/service.exception';
import { Pedido } from 'src/enterprise/pedido/model/pedido.model';
import { IPedidoRepository } from 'src/enterprise/pedido/repository/pedido.repository.interface';
import { SalvarPedidoValidator } from 'src/application/pedido/validation/salvar-pedido.validator';
import { PedidoConstants } from 'src/shared/constants';
import { ValidatorUtils } from 'src/shared/validator.utils';

@Injectable()
export class SalvarPedidoUseCase {
   private logger = new Logger(SalvarPedidoUseCase.name);

   constructor(
      @Inject(PedidoConstants.IREPOSITORY) private repository: IPedidoRepository,
      @Inject(PedidoConstants.SALVAR_PEDIDO_VALIDATOR)
      private validators: SalvarPedidoValidator[],
   ) {}

   async salvarPedido(pedido: Pedido): Promise<Pedido> {
      await ValidatorUtils.executeValidators(this.validators, pedido);
      return await this.repository
         .save(pedido)
         .then((novoPedido) => novoPedido)
         .catch((error) => {
            this.logger.error(`Erro ao salvar no banco de dados: ${error} `);
            throw new ServiceException(`Houve um erro ao criar novo pedido: ${error}`);
         });
   }
}
