import { Inject, Injectable, Logger } from '@nestjs/common';
import { BuscarItensPorPedidoIdUseCase } from 'src/application/pedido/usecase/buscar-itens-por-pedido-id.usecase';
import { EditarPedidoUseCase } from 'src/application/pedido/usecase/editar-pedido.usecase';
import { SalvarPedidoValidator } from 'src/application/pedido/validation/salvar-pedido.validator';
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
      private validators: SalvarPedidoValidator[],
   ) {}

   async checkout(pedido: Pedido): Promise<Pedido> {
      await ValidatorUtils.executeValidators(this.validators, pedido);

      // listar items pedido
      const itemPedidos = await this.buscarItensPorPedidoIdUseCase.buscarItensPedidoPorPedidoId(pedido.id);

      // calcular o total do pedido
      let totalPedido = 0;
      itemPedidos.forEach(async (itemPedido) => {
         const produto = await this.buscarProdutoPorIdUseCase.buscarProdutoPorID(itemPedido.produtoId);
         totalPedido += itemPedido.quantidade * produto.preco;
      });

      pedido.total = totalPedido;

      // TODO: invocar usecase para gerar solicitação de pagamentoquando o estiver pronto

      const pedidoEditado = await this.editarPedidoUseCase.editarPedido(pedido);
      return pedidoEditado;
   }
}
