import { Body, Controller, Inject, Logger, Post } from '@nestjs/common';
import { Cliente } from 'src/domain/cliente/model/cliente.model';
import { IService } from 'src/domain/service/service';
import { ApiCreatedResponse, ApiTags } from '@nestjs/swagger';
import { SalvarClienteRequest } from '../request/salvar-cliente.request';

@Controller('v1/cliente')
@ApiTags("Cliente")
export class ClientController {

    private logger: Logger = new Logger(ClientController.name)

    constructor(@Inject('IService<Cliente>') private service: IService<Cliente>) { }

    @Post()
    @ApiCreatedResponse({description: "Cliente salvo com sucesso"})
    async save(@Body() request: SalvarClienteRequest): Promise<Cliente> {
        this.logger.debug(`Salvando cliente request: ${SalvarClienteRequest.toString(request)}`)
        return await this.service.save({
            nome: request.nome,
            email: request.email,
            cpf: request.cpf
        }).then(cliente =>{
            this.logger.log(`Cliente salvo com sucesso: ${cliente.id}}`)
            return cliente;
        })
    }

}
