import { Body, Controller, Get, Inject, Logger, NotFoundException, Param, Post } from '@nestjs/common';
import { ApiConsumes, ApiCreatedResponse, ApiProduces, ApiResponse, ApiTags } from '@nestjs/swagger';

import { Pedido } from 'src/domain/pedido/model/pedido.model';
import { CriarNovoPedidoRequest } from '../request';
import { PedidoConstants } from 'src/shared/constants';
import { EstadoPedido } from 'src/domain/pedido/enums/pedido';
import { IPedidoService } from 'src/domain/pedido/service/pedido.service.interface';

@Controller('v1/pedido')
@ApiTags('Pedido')
@ApiConsumes('application/json')
@ApiProduces('application/json')
export class PedidoController {
   private logger: Logger = new Logger(PedidoController.name);

   constructor(@Inject(PedidoConstants.ISERVICE) private service: IPedidoService) {}

   @Post()
   @ApiCreatedResponse({ description: 'Pedido gerado com sucesso' })
   async salvar(@Body() novoPedido: CriarNovoPedidoRequest): Promise<Pedido> {
      this.logger.debug(`Criando Novo Pedido Request: ${JSON.stringify(novoPedido)}`);
      return await this.service.save(novoPedido).then((pedidoCriado) => {
         this.logger.log(`Pedido gerado com sucesso: ${pedidoCriado.id}}`);
         return pedidoCriado;
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
