import { Body, Controller, Get, Inject, Logger, NotFoundException, Post, Query } from '@nestjs/common';
import {
   ApiConsumes,
   ApiCreatedResponse,
   ApiFoundResponse,
   ApiNotFoundResponse,
   ApiProduces,
   ApiTags,
} from '@nestjs/swagger';

import { Cliente } from 'src/domain/cliente/model/cliente.model';
import { SalvarClienteRequest } from '../request/salvar-cliente.request';
import { IClienteService } from 'src/domain/cliente/service/cliente.service.interface';

@Controller('v1/cliente')
@ApiTags('Cliente')
@ApiConsumes('application/json')
@ApiProduces('application/json')
export class ClienteController {
   private logger: Logger = new Logger(ClienteController.name);

   constructor(@Inject('IService<Cliente>') private service: IClienteService) {}

   @Post()
   @ApiCreatedResponse({ description: 'Cliente salvo com sucesso' })
   async salvar(@Body() request: SalvarClienteRequest): Promise<Cliente> {
      this.logger.debug(`Salvando cliente request: ${JSON.stringify(request)}`);
      return await this.service
         .save({
            nome: request.nome,
            email: request.email,
            cpf: request.cpf,
         })
         .then((cliente) => {
            this.logger.log(`Cliente salvo com sucesso: ${cliente.id}}`);
            return cliente;
         });
   }

   @Get()
   @ApiFoundResponse({ description: 'Cliente consultado com sucesso' })
   @ApiNotFoundResponse({ description: 'Cliente não encontrado' })
   async buscaPorCpf(@Query('cpf') cpf: string): Promise<Cliente> {
      this.logger.debug(`Consultando cliente por cpf: ${cpf}`);
      return await this.service.findByCpf(cpf).then((cliente) => {
         if (cliente === undefined) {
            throw new NotFoundException('Cliente não encontrado');
         }

         return cliente;
      });
   }
}
