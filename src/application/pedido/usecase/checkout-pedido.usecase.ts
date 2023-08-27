import { Inject, Injectable, Logger } from '@nestjs/common';
import { BuscarItensPorPedidoIdUseCase } from 'src/application/pedido/usecase/buscar-itens-por-pedido-id.usecase';
import { EditarPedidoUseCase } from 'src/application/pedido/usecase/editar-pedido.usecase';
import { CheckoutPedidoValidator } from 'src/application/pedido/validation/checkout-pedido.validator';
import { BuscarProdutoPorIdUseCase } from 'src/application/produto/usecase/buscar-produto-por-id.usecase';
import { Pedido } from 'src/enterprise/pedido/model/pedido.model';
import { PedidoConstants } from 'src/shared/constants';
import { ValidatorUtils } from 'src/shared/validator.utils';

@Injectable()
export class CheckoutPedidoUseCase {
   private logger = new Logger(CheckoutPedidoUseCase.name);

   constructor(
      @Inject(BuscarProdutoPorIdUseCase) private buscarProdutoPorIdUseCase: BuscarProdutoPorIdUseCase,
      @Inject(BuscarItensPorPedidoIdUseCase) private buscarItensPorPedidoIdUseCase: BuscarItensPorPedidoIdUseCase,
      @Inject(EditarPedidoUseCase) private editarPedidoUseCase: EditarPedidoUseCase,
      @Inject(PedidoConstants.SALVAR_PEDIDO_VALIDATOR)
      private validators: CheckoutPedidoValidator[],
   ) {}

   async checkout(pedido: Pedido): Promise<Pedido> {
      this.logger.log('1');
      await ValidatorUtils.executeValidators(this.validators, pedido);
      this.logger.log('2');
      // listar items pedido
      const itemPedidos = await this.buscarItensPorPedidoIdUseCase.buscarItensPedidoPorPedidoId(pedido.id);
      this.logger.log('3');
      // calcular o total do pedido
      let totalPedido = 0;
      for (const itemPedido of itemPedidos) {
         this.logger.log('4');
         const produto = await this.buscarProdutoPorIdUseCase.buscarProdutoPorID(itemPedido.produtoId);
         totalPedido += itemPedido.quantidade * produto.preco;
      }
      this.logger.log('5');
      pedido.total = totalPedido;

      // TODO: invocar usecase para gerar solicitação de pagamentoquando o estiver pronto

      this.logger.log('6');
      const pedidoRetornado = await this.editarPedidoUseCase.editarPedido(pedido);
      this.logger.log(`pedidoRetornado: ${pedidoRetornado}`);

      return pedidoRetornado;
   }
}
