import { Inject, Injectable, Logger } from '@nestjs/common';
import { ValidationException } from 'src/enterprise/exception/validation.exception';
import { Produto } from 'src/enterprise/produto/model/produto.model';
import { ItemPedido } from 'src/enterprise/item-pedido/model';
import { AddItemPedidoValidator } from 'src/application/item-pedido/validation/add-item-pedido.validator';
import { IRepository } from 'src/enterprise/repository/repository';
import { ProdutoConstants } from 'src/shared/constants';

@Injectable()
export class ProdutoInativoPedidoValidator implements AddItemPedidoValidator {
   public static ERROR_MESSAGE = 'O produto está inativo';

   private logger: Logger = new Logger(ProdutoInativoPedidoValidator.name);

   constructor(@Inject(ProdutoConstants.IREPOSITORY) private repository: IRepository<Produto>) {}

   async validate({ produtoId }: ItemPedido): Promise<boolean> {
      this.logger.log(
         `Inicializando validação ${ProdutoInativoPedidoValidator.name} para criar o pedido com o produto: ${produtoId}`,
      );

      await this.repository.findBy({ id: produtoId }).then((produtos) => {
         if (produtos[0].ativo) {
            this.logger.debug(
               `${ProdutoInativoPedidoValidator.name} finalizado com sucesso para produto: ${produtoId}`,
            );
            return true;
         }

         throw new ValidationException(ProdutoInativoPedidoValidator.ERROR_MESSAGE);
      });

      return true;
   }
}
