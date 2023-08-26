import { Inject, Injectable } from '@nestjs/common';
import { ItemPedido } from 'src/enterprise/item-pedido/model';
import { ItemPedidoConstants } from 'src/shared/constants';
import { IItemPedidoService } from 'src/application/item-pedido/service/item-pedido.service.interface';
import { DeletarItemPedidoUseCase } from 'src/application/item-pedido/usecase/deletar-item-pedido.usecase';
import { EditarItemPedidoUsecase } from 'src/application/item-pedido/usecase/editar-item-pedido.usecase';
import { SalvarItemPedidoUseCase } from 'src/application/item-pedido/usecase/salvar-item-pedido.usecase';

@Injectable()
export class ItemPedidoService implements IItemPedidoService {
   constructor(
      @Inject(ItemPedidoConstants.SALVAR_ITEM_PEDIDO_USECASE) private salvarUsecase: SalvarItemPedidoUseCase,
      @Inject(ItemPedidoConstants.EDITAR_ITEM_PEDIDO_USECASE) private editarUsecase: EditarItemPedidoUsecase,
      @Inject(ItemPedidoConstants.DELETAR_ITEM_PEDIDO_USECASE) private deletarUsecase: DeletarItemPedidoUseCase,
   ) {}

   async save(item: ItemPedido): Promise<ItemPedido> {
      return await this.salvarUsecase.salvarItemPedido(item);
   }

   async edit(item: ItemPedido): Promise<ItemPedido> {
      return await this.editarUsecase.editarItemPedido(item);
   }

   async delete(id: number): Promise<boolean> {
      return await this.deletarUsecase.deletarItemPedido(id);
   }
}
