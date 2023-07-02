import {
   Body,
   Controller,
   Get,
   HttpCode,
   Inject,
   Logger,
   NotFoundException,
   Post,
   Query,
   ValidationPipe,
} from '@nestjs/common';
import { ApiCreatedResponse, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';

import { SalvarClienteRequest } from '../request/salvar-cliente.request';
import { IClienteService } from 'src/domain/cliente/service/cliente.service.interface';
import { BuscarPorCpfClienteRequest } from '../request/buscar-por-cpf-cliente.request';
import { IdentificarPorCpfClienteRequest } from '../request/identificar-por-cpf-cliente.request';
import { SalvarClienteResponse } from '../response/salvar-cliente.response';
import { BuscarPorCpfClienteResponse } from '../response/buscar-por-cpf-cliente.response';
import { BaseController } from '../../base.controller';
import { IdentificarPorCpfClienteResponse } from '../response/identificar-por-cpf-cliente.response';

@Controller('v1/cliente')
@ApiTags('Cliente')
export class ClienteController extends BaseController {
   private logger: Logger = new Logger(ClienteController.name);

   constructor(@Inject('IService<Cliente>') private service: IClienteService) {
      super();
   }

   @Post()
   @ApiOperation({
      summary: 'Adiciona um novo cliente',
      description: 'Adiciona um novo cliente identificado por nome, email e cpf',
   })
   @ApiCreatedResponse({ description: 'Cliente salvo com sucesso', type: SalvarClienteResponse })
   async salvar(@Body() request: SalvarClienteRequest): Promise<SalvarClienteResponse> {
      this.logger.debug(`Salvando cliente request: ${JSON.stringify(request)}`);
      return await this.service
         .save({
            nome: request.nome,
            email: request.email,
            cpf: request.cpf,
         })
         .then((cliente) => {
            this.logger.log(`Cliente salvo com sucesso: ${cliente.id}}`);
            return new SalvarClienteResponse(cliente);
         });
   }

   @Get()
   @ApiOperation({ summary: 'Consulta cliente por CPF', description: 'Realiza consulta de cliente por CPF' })
   @ApiOkResponse({ description: 'Cliente consultado com sucesso', type: BuscarPorCpfClienteResponse })
   async buscaPorCpf(@Query(ValidationPipe) query: BuscarPorCpfClienteRequest): Promise<BuscarPorCpfClienteResponse> {
      this.logger.debug(`Consultando cliente por cpf: ${query}`);
      return await this.service.findByCpf(query.cpf).then((cliente) => {
         if (cliente === undefined) {
            throw new NotFoundException('Cliente não encontrado');
         }

         return new BuscarPorCpfClienteResponse(cliente);
      });
   }

   @Post('identifica')
   @ApiOperation({ summary: 'Identifica cliente por CPF', description: 'Realiza identificação de cliente por CPF' })
   @HttpCode(200)
   @ApiOkResponse({ description: 'Cliente identificado com sucesso', type: IdentificarPorCpfClienteResponse })
   async identificaCliente(
      @Query(ValidationPipe) query: IdentificarPorCpfClienteRequest,
   ): Promise<IdentificarPorCpfClienteResponse> {
      this.logger.debug(`Identificando cliente request: ${query.cpf}`);
      return await this.service.identifyByCpf(query.cpf).then((clienteIdentificado) => {
         this.logger.log(`Cliente identificado com sucesso: ${JSON.stringify(clienteIdentificado)}`);
         return new IdentificarPorCpfClienteResponse(clienteIdentificado);
      });
   }
}
