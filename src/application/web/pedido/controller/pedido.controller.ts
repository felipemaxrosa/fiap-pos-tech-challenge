import { Body, Controller, Inject, Logger, Post } from '@nestjs/common';
import { ApiConsumes, ApiCreatedResponse, ApiProduces, ApiTags } from '@nestjs/swagger';

import { Pedido } from 'src/domain/pedido/model/pedido.model';
import { IService } from 'src/domain/service/service';
import { CriarNovoPedidoRequest } from '../request/criar-novo-pedido.request';
import { ESTADO_PEDIDO } from 'src/domain/pedido/enums/pedido';
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
   async salvar(@Body() request: CriarNovoPedidoRequest): Promise<Pedido> {
      this.logger.debug(`Criando Novo Pedido Request: ${JSON.stringify(request)}`);
      return await this.service
         .save({
            clienteId: request.clienteId,
            dataInicio: request.dataInicio,
            estadoPedido: ESTADO_PEDIDO.EM_PREPARO,
         })
         .then((pedido) => {
            this.logger.log(`Pedido gerado com sucesso: ${pedido.id}}`);
            return pedido;
         });
   }
}
