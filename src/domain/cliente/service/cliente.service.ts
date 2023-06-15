import { Inject, Injectable, Logger } from "@nestjs/common";
import { Cliente } from "src/domain/cliente/model/cliente.model";
import { IService } from "src/domain/service/service";
import { SalvarClienteValidator } from "src/domain/cliente/validation/salvar-cliente.validator";
import { IRepository } from "src/domain/repository/repository";
import { ServiceException } from "src/domain/exception/service.exception";


@Injectable()
export class ClienteService implements IService<Cliente>{
    
    private logger: Logger = new Logger(ClienteService.name);

    constructor(
        @Inject('IRepository<Cliente>') private repository: IRepository<Cliente>, 
        @Inject('SalvarClienteValidator') private validators: SalvarClienteValidator[]){}
    
    async save(cliente: Cliente): Promise<Cliente> {
        
        for(const validator of this.validators){
            await validator.validate(cliente)
        }

        return await this.repository.save({
                    nome: cliente.nome,
                    email: cliente.email,
                    cpf: cliente.cpf,
                }).catch(error => {
                    this.logger.error(`Erro ao salvar no banco de dados: ${error} ` )
                    throw new ServiceException(`Houve um erro ao salvar o cliente: ${error}`)
                })
    }
}
