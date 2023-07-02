import { Body, Controller, Get, Inject, Logger, NotFoundException, Param, Post } from '@nestjs/common';
import { ApiCreatedResponse, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

import { Pedido } from 'src/domain/pedido/model/pedido.model';
import { PedidoConstants } from 'src/shared/constants';
import { EstadoPedido } from 'src/domain/pedido/enums/pedido';
import { IPedidoService } from 'src/domain/pedido/service/pedido.service.interface';
import { BaseController } from '../../base.controller';
import { SalvarPedidoRequest } from '../request';
import { SalvarPedidoResponse } from '../response/salvar-pedido.response';
import { BuscarPorIdEstadoPedidoResponse } from '../response/buscar-por-id-estado-pedido.response';
import { BuscarPorIdPedidoResponse } from '../response/buscar-por-id-pedido.response';
import { BuscarTodosPorEstadoPedidoResponse } from '../response/buscar-todos-por-estado-pedido.response';

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
   @ApiOperation({
      summary: 'Consulta pedido por ID',
      description: 'Realiza a consulta um pedido por ID',
   })
   @ApiResponse({ status: 200, description: 'Pedido encontrado com sucesso', type: BuscarPorIdPedidoResponse })
   async findById(@Param('id') id: number): Promise<BuscarPorIdPedidoResponse> {
      this.logger.debug(`Procurando Pedido id: ${id}`);
      return await this.service.findById(id).then((pedido) => {
         if (pedido) {
            this.logger.log(`Pedido encontrado com sucesso: ${pedido.id}}`);
            return new BuscarPorIdPedidoResponse(pedido);
         }
         this.logger.debug(`Pedido não encontrado: ${id}`);
         throw new NotFoundException('Pedido não encontrado');
      });
   }

   @Get(':id/estado')
   @ApiOperation({
      summary: 'Consulta o estado do pedido por ID',
      description: 'Realiza a consulta do estado do pedido por ID',
   })
   @ApiResponse({ status: 200, description: 'Pedido encontrado com sucesso', type: BuscarPorIdEstadoPedidoResponse })
   async findByIdEstadoDoPedido(@Param('id') id: number): Promise<BuscarPorIdEstadoPedidoResponse> {
      this.logger.debug(`Procurando Pedido id: ${id}`);

      return await this.service.findById(id).then((pedido) => {
         if (pedido) {
            this.logger.log(`Pedido encontrado com sucesso: ${pedido.id}}`);
            return new BuscarPorIdEstadoPedidoResponse(pedido.estadoPedido);
         }

         this.logger.debug(`Pedido não encontrado: ${id}`);
         throw new NotFoundException(`Pedido não encontrado: ${id}`);
      });
   }

   @Get('estado/:id')
   @ApiOperation({
      summary: 'Consulta de pedidos por estado',
      description: 'Realiza a consulta de todos os pedidos por estado',
   })
   @ApiResponse({
      status: 200,
      description: 'Pedidos encontrados com sucesso',
      type: BuscarTodosPorEstadoPedidoResponse,
   })
   async findAllByEstadoDoPedido(@Param('id') estado: EstadoPedido): Promise<BuscarTodosPorEstadoPedidoResponse[]> {
      this.logger.debug(`Procurando Pedidos com estado: ${estado}`);

      return await this.service.findAllByEstadoDoPedido(estado).then((pedidos) => {
         if (pedidos.length > 0) {
            this.logger.log(`Pedidos com estado: ${estado} encontrados com sucesso`);
            return pedidos.map((pedido) => new BuscarTodosPorEstadoPedidoResponse(pedido));
         }

         this.logger.debug(`Pedidos com estado: ${estado} não encontrados`);
         throw new NotFoundException(`Pedidos com estado: ${estado} não encontrados`);
      });
   }
}
