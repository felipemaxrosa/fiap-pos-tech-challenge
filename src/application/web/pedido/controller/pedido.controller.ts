import { Body, Controller, Inject, Logger, Post } from '@nestjs/common';
import { ApiConsumes, ApiCreatedResponse, ApiProduces, ApiTags } from '@nestjs/swagger';

import { Pedido } from 'src/domain/pedido/model/pedido.model';
import { IService } from 'src/domain/service/service';
import { CriarNovoPedidoRequest } from '../request';
import { PedidoConstants } from 'src/shared/constants';

@Controller('v1/pedido')
@ApiTags('Pedido')
@ApiConsumes('application/json')
@ApiProduces('application/json')
export class PedidoController {
   private logger: Logger = new Logger(PedidoController.name);

   constructor(@Inject(PedidoConstants.ISERVICE) private service: IService<Pedido>) {}

   @Post()
   @ApiCreatedResponse({ description: 'Pedido gerado com sucesso' })
   async salvar(@Body() novoPedido: CriarNovoPedidoRequest): Promise<Pedido> {
      this.logger.debug(`Criando Novo Pedido Request: ${JSON.stringify(novoPedido)}`);
      return await this.service.save(novoPedido).then((pedido) => {
         this.logger.log(`Pedido gerado com sucesso: ${pedido.id}}`);
         return pedido;
      });
   }
}
