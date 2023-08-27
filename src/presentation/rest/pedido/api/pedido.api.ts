import { Body, Controller, Get, Inject, Logger, NotFoundException, Param, ParseIntPipe, Post } from '@nestjs/common';
import { ApiCreatedResponse, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { IPedidoService } from 'src/application/pedido/service/pedido.service.interface';
import { ServiceException } from 'src/enterprise/exception/service.exception';
import { EstadoPedido } from 'src/enterprise/pedido/enums/pedido';
import { Pedido } from 'src/enterprise/pedido/model/pedido.model';
import { BaseRestApi } from 'src/presentation/rest/base.api';
import { SalvarPedidoRequest } from 'src/presentation/rest/pedido/request';
import {
   BuscarPorIdEstadoPedidoResponse,
   BuscarPorIdPedidoResponse,
   BuscarTodosPorEstadoPedidoResponse,
   ListarPedidoNaoFinalizadoResponse,
   ListarPedidoPendenteResponse,
   SalvarPedidoResponse,
} from 'src/presentation/rest/pedido/response';
import { CheckoutPedidoResponse } from 'src/presentation/rest/pedido/response/checkout-pedido.response';
import { PedidoConstants } from 'src/shared/constants';

@Controller('v1/pedido')
@ApiTags('Pedido')
export class PedidoRestApi extends BaseRestApi {
   private logger: Logger = new Logger(PedidoRestApi.name);

   constructor(@Inject(PedidoConstants.ISERVICE) private service: IPedidoService) {
      super();
   }

   @Get()
   @ApiOperation({
      summary: 'Lista todos os pedidos nao finalizados',
      description: 'Lista de pedidos com status diferente de pagamento pendente e entregue',
   })
   @ApiOkResponse({
      description: 'Pedidos encontrados com sucesso',
      type: ListarPedidoNaoFinalizadoResponse,
      isArray: true,
   })
   async listarPedidosNaoFinalizados(): Promise<ListarPedidoNaoFinalizadoResponse[]> {
      this.logger.debug(`Listando pedidos nao finalizados`);

      return await this.service.listarPedidosNaoFinalizados().then((pedidos) => {
         return pedidos.map((pedido) => new ListarPedidoNaoFinalizadoResponse(pedido));
      });
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

   @Get('/pendentes')
   @ApiOperation({
      summary: 'Lista pedidos pendentes',
      description: 'Lista pedidos com status recebido ou em preparo',
   })
   @ApiOkResponse({
      description: 'Pedidos encontrados com sucesso',
      type: ListarPedidoPendenteResponse,
      isArray: true,
   })
   async listarPendentes(): Promise<ListarPedidoPendenteResponse[]> {
      this.logger.debug(`Listando pedidos pendentes`);

      return await this.service.listarPedidosPendentes().then((pedidos) => {
         return pedidos.map((pedido) => new ListarPedidoPendenteResponse(pedido));
      });
   }

   @Get(':id')
   @ApiOperation({
      summary: 'Consulta pedido por ID',
      description: 'Realiza a consulta um pedido por ID',
   })
   @ApiOkResponse({ description: 'Pedido encontrado com sucesso', type: BuscarPorIdPedidoResponse })
   async findById(@Param('id', ParseIntPipe) id: number): Promise<BuscarPorIdPedidoResponse> {
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
   @ApiOkResponse({ description: 'Pedido encontrado com sucesso', type: BuscarPorIdEstadoPedidoResponse })
   async findByIdEstadoDoPedido(@Param('id', ParseIntPipe) id: number): Promise<BuscarPorIdEstadoPedidoResponse> {
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
   @ApiOkResponse({
      description: 'Pedidos encontrados com sucesso',
      type: BuscarTodosPorEstadoPedidoResponse,
      isArray: true,
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

   @Post('checkout/:id')
   @ApiOperation({
      summary: 'Realiza o checkout do pedido',
      description: 'Realiza o checkout do pedido',
   })
   @ApiOkResponse({ description: 'Pedido encontrado com sucesso', type: CheckoutPedidoResponse })
   async checkout(@Param('id', ParseIntPipe) id: number): Promise<CheckoutPedidoResponse> {
      this.logger.debug(`Realizando checkout do pedido id: ${id}`);

      const pedido = await this.service.findById(id).then((pedidoBuscado) => {
         if (pedidoBuscado) {
            this.logger.log(`Pedido encontrado com sucesso: ${pedidoBuscado.id}}`);
            return pedidoBuscado;
         }
         this.logger.debug(`Pedido não encontrado: ${id}`);
         throw new NotFoundException(`Pedido não encontrado: ${id}`);
      });

      return await this.service.checkout(pedido).then((pedidoCheckout) => {
         if (pedidoCheckout) {
            this.logger.log(`Checkout realizado com sucesso para pedido: ${pedidoCheckout.id}}`);
            return new CheckoutPedidoResponse(pedidoCheckout);
         }
         this.logger.debug(`Erro durante realização de checkout do pedido: ${id}`);
         throw new ServiceException('Pedido não encontrado');
      });
   }
}
