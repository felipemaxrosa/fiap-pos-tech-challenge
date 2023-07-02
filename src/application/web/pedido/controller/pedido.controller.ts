import { Body, Controller, Get, Inject, Logger, NotFoundException, Param, Post } from '@nestjs/common';
import { ApiCreatedResponse, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

import { Pedido } from 'src/domain/pedido/model/pedido.model';
import { PedidoConstants } from 'src/shared/constants';
import { EstadoPedido } from 'src/domain/pedido/enums/pedido';
import { IPedidoService } from 'src/domain/pedido/service/pedido.service.interface';
import { BaseController } from '../../base.controller';
import { SalvarPedidoRequest } from '../request';
import { SalvarPedidoResponse } from '../response/salvar-pedido.response';

@Controller('v1/pedido')
@ApiTags('Pedido')
export class PedidoController extends BaseController {
   private logger: Logger = new Logger(PedidoController.name);

   constructor(@Inject(PedidoConstants.ISERVICE) private service: IPedidoService) {
      super();
   }

   @Post()
   @ApiOperation({
      summary: 'Adiciona um novo pedido',
      description:
         'Adiciona um novo pedido para o cliente, contendo o identificador do cliente, a data de início do pedido, o estado e indicador se é um pedido ativo',
   })
   @ApiCreatedResponse({ description: 'Pedido gerado com sucesso', type: SalvarPedidoResponse })
   async salvar(@Body() novoPedido: SalvarPedidoRequest): Promise<Pedido> {
      this.logger.debug(`Criando Novo Pedido Request: ${JSON.stringify(novoPedido)}`);
      return await this.service
         .save({
            clienteId: novoPedido.clienteId,
            dataInicio: novoPedido.dataInicio,
            estadoPedido: novoPedido.estadoPedido,
            ativo: novoPedido.ativo,
         })
         .then((pedidoCriado) => {
            this.logger.log(`Pedido gerado com sucesso: ${pedidoCriado.id}}`);
            return new SalvarPedidoResponse(pedidoCriado);
         });
   }

   @Get(':id')
   @ApiResponse({ status: 200, description: 'Pedido encontrado com sucesso' })
   @ApiResponse({ status: 404, description: 'Pedido não encontrado' })
   async findById(@Param('id') id: number): Promise<Pedido> {
      this.logger.debug(`Procurando Pedido id: ${id}`);
      return await this.service.findById(id).then((pedido) => {
         if (pedido) {
            this.logger.log(`Pedido encontrado com sucesso: ${pedido.id}}`);
            return pedido;
         }
         this.logger.debug(`Pedido não encontrado: ${id}`);
         throw new NotFoundException('Pedido não encontrado');
      });
   }

   @Get(':id/estado')
   @ApiResponse({ status: 200, description: 'Pedido encontrado com sucesso' })
   @ApiResponse({ status: 404, description: 'Pedido não encontrado' })
   async findByIdEstadoDoPedido(@Param('id') id: number): Promise<{ estadoPedido: EstadoPedido }> {
      this.logger.debug(`Procurando Pedido id: ${id}`);

      return await this.service.findById(id).then((pedido) => {
         if (pedido) {
            this.logger.log(`Pedido encontrado com sucesso: ${pedido.id}}`);
            return {
               estadoPedido: pedido.estadoPedido,
            };
         }

         this.logger.debug(`Pedido não encontrado: ${id}`);
         throw new NotFoundException(`Pedido não encontrado: ${id}`);
      });
   }

   @Get('estado/:id')
   @ApiResponse({ status: 200, description: 'Pedidos encontrados com sucesso' })
   @ApiResponse({ status: 404, description: 'Pedidos não encontrados para o estado escolhido' })
   async findAllByEstadoDoPedido(@Param('id') estado: EstadoPedido): Promise<Pedido[]> {
      this.logger.debug(`Procurando Pedidos com estado: ${estado}`);

      return await this.service.findAllByEstadoDoPedido(estado).then((pedidos) => {
         if (pedidos.length > 0) {
            this.logger.log(`Pedidos com estado: ${estado} encontrados com sucesso`);
            return pedidos;
         }

         this.logger.debug(`Pedidos com estado: ${estado} não encontrados`);
         throw new NotFoundException(`Pedidos com estado: ${estado} não encontrados`);
      });
   }
}
