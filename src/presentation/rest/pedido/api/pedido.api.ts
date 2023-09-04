import {
   Body,
   Controller,
   Get,
   HttpCode,
   Inject,
   Logger,
   NotFoundException,
   Param,
   ParseIntPipe,
   Post,
   Put,
} from '@nestjs/common';
import { ApiCreatedResponse, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { IPedidoService } from 'src/application/pedido/service/pedido.service.interface';
import { ServiceException } from 'src/enterprise/exception/service.exception';
import { EstadoPedido } from 'src/enterprise/pedido/enum/estado-pedido.enum';
import { Pedido } from 'src/enterprise/pedido/model/pedido.model';
import { BaseRestApi } from 'src/presentation/rest/base.api';
import { SalvarPedidoRequest } from 'src/presentation/rest/pedido/request';
import { EditarPedidoRequest } from 'src/presentation/rest/pedido/request/editar-pedido.request';
import {
   BuscarPorIdEstadoPedidoResponse,
   BuscarPorIdPedidoResponse,
   BuscarTodosPorEstadoPedidoResponse,
   ListarPedidoNaoFinalizadoResponse,
   ListarPedidoPendenteResponse,
   SalvarPedidoResponse,
} from 'src/presentation/rest/pedido/response';
import { CheckoutResponse } from 'src/presentation/rest/pedido/response';
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
      summary: 'Lista todos os pedidos (recebidos, em preparação e pronto)',
      description: 'Lista pedidos, ordenado pelos status PRONTO (3), EM_PREPARACAO (2) e RECEBIDO (1)',
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
      return await this.service.save(novoPedido).then((pedidoCriado) => {
         this.logger.log(`Pedido gerado com sucesso: ${pedidoCriado.id}}`);
         return new SalvarPedidoResponse(pedidoCriado);
      });
   }

   @Put(':id')
   @ApiOperation({
      summary: 'Edita um pedido',
      description: 'Edita um pedido, identificado pelo id',
   })
   @ApiOkResponse({ description: 'Pedido editado com sucesso', type: EditarPedidoRequest })
   async editar(@Param('id', ParseIntPipe) id: number, @Body() request: EditarPedidoRequest): Promise<Pedido> {
      this.logger.debug(`Editando pedido request: ${JSON.stringify(request)}`);

      return await this.service
         .edit({
            ...request,
            id,
         })
         .then((pedido) => {
            this.logger.log(`Pedido editado com sucesso: ${pedido.id}`);
            return pedido;
         });
   }

   @Get('/pendentes')
   @ApiOperation({
      summary: 'Lista pedidos pendentes de pagamento',
      description: 'Lista pedidos pendentes (PAGAMENTO_PENDENTE=0)',
   })
   @ApiOkResponse({
      description: 'Pedidos encontrados com sucesso',
      type: ListarPedidoPendenteResponse,
      isArray: true,
   })
   async listarPendentes(): Promise<ListarPedidoPendenteResponse[]> {
      this.logger.debug(`Listando pedidos pendentes de pagamento`);

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
      description:
         'Realiza a consulta do estado do pedido por ID onde PAGAMENTO_PENDENTE = 0, RECEBIDO = 1, EM_PREPARACAO = 2, PRONTO = 3, FINALIZADO = 4',
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
      summary: 'Consulta de pedidos por estado do pedido',
      description:
         'Realiza a consulta de todos os pedidos por estado onde PAGAMENTO_PENDENTE = 0, RECEBIDO = 1, EM_PREPARACAO = 2, PRONTO = 3, FINALIZADO = 4',
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
      description:
         'Realiza o checkout do pedido, retornando uma propriedade chamada transacaoId dentro de pagamento, que simula um ID gerado por um servico externo para ser feito um pagamento. Este transacaoId deve ser usada na chamada ao webhook',
   })
   @HttpCode(200)
   @ApiOkResponse({ description: 'Pedido encontrado com sucesso', type: CheckoutResponse })
   async checkout(@Param('id', ParseIntPipe) id: number): Promise<CheckoutResponse> {
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
            this.logger.log(`Checkout realizado com sucesso para pedido: ${pedidoCheckout.pedido.id}}`);
            return new CheckoutResponse(pedidoCheckout);
         }
         this.logger.debug(`Erro durante realização de checkout do pedido: ${id}`);
         throw new ServiceException(`Erro durante realização de checkout do pedido: ${id}`);
      });
   }
}
