import { Inject, Injectable, Logger } from '@nestjs/common';
import { ValidationException } from 'src/enterprise/exception/validation.exception';
import { Produto } from 'src/enterprise/produto/model/produto.model';
import { ItemPedido } from 'src/enterprise/item-pedido/model';
import { AddItemPedidoValidator } from 'src/application/item-pedido/validation/add-item-pedido.validator';
import { IRepository } from 'src/enterprise/repository/repository';
import { ProdutoConstants } from 'src/shared/constants';

@Injectable()
export class ProdutoExistentePedidoValidator implements AddItemPedidoValidator {
   public static ERROR_MESSAGE = 'Código de produto inexistente';

   private logger: Logger = new Logger(ProdutoExistentePedidoValidator.name);

   constructor(@Inject(ProdutoConstants.IREPOSITORY) private repository: IRepository<Produto>) {}

   async validate({ produtoId }: ItemPedido): Promise<boolean> {
      this.logger.log(
         `Inicializando validação ${ProdutoExistentePedidoValidator.name} para criar o pedido com o produto: ${produtoId}`,
      );

      await this.repository.findBy({ id: produtoId }).then((produtos) => {
         if (produtos.length > 0) {
            this.logger.debug(
               `${ProdutoExistentePedidoValidator.name} finalizado com sucesso para produto: ${produtoId}`,
            );
            return true;
         }

         throw new ValidationException(ProdutoExistentePedidoValidator.ERROR_MESSAGE);
      });

      return true;
   }
}
