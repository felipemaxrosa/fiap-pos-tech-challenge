import { Inject, Injectable, Logger } from '@nestjs/common';

import { Pedido } from '../model/pedido.model';
import { IService } from 'src/domain/service/service';
import { IRepository } from 'src/domain/repository/repository';
import { ServiceException } from 'src/domain/exception/service.exception';
import { PedidoConstants } from 'src/shared/constants';
import { CriarNovoPedidoValidator } from '../validation/criar-novo-pedido.validator';

@Injectable()
export class PedidoService implements IService<Pedido> {
   private logger = new Logger(PedidoService.name);

   constructor(
      @Inject(PedidoConstants.IREPOSITORY) private repository: IRepository<Pedido>,
      @Inject('CriarNovoPedidoValidator')
      private validators: CriarNovoPedidoValidator[],
   ) {}
  
   edit(type: Pedido): Promise<Pedido> {
      throw new Error('Method not implemented.');
   }
   delete(id: number): Promise<boolean> {
      throw new Error('Method not implemented.');
   }

   async save(pedido: Pedido): Promise<Pedido> {
      for (const validator of this.validators) {
         await validator.validate(pedido);
      }

      try {
         const novoPedido = await this.repository.save({
            clienteId: pedido.clienteId,
            dataInicio: pedido.dataInicio,
            estadoPedido: pedido.estadoPedido,
         });

         return novoPedido;
      } catch (error) {
         this.logger.error(`Erro ao salvar no banco de dados: ${error} `);
         throw new ServiceException(`Houve um erro ao criar novo pedido: ${error}`);
      }
   }
}
