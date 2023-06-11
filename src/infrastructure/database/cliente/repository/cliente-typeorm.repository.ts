import { Injectable, Logger } from "@nestjs/common";
import { Cliente } from "../../../../domain/cliente/model/cliente.model";
import { IRepository } from "../../../../domain/repository/repository";
import { ClienteEntity } from "../entity/cliente.entity";
import { Repository} from "typeorm"
import { InjectRepository } from "@nestjs/typeorm";
import { RepositoryException } from "../../../exception/repository-infraestructure.exception";

@Injectable()
export class ClienteTypeormRepository implements IRepository<Cliente>{
    
    private logger: Logger = new Logger(ClienteTypeormRepository.name)

    constructor(@InjectRepository(ClienteEntity) private repository: Repository<ClienteEntity>){}
    
    async findBy(attributes: {}): Promise<Cliente[]> {
        this.logger.debug(`Realizando consulta de cliente: com os parâmetros ${JSON.stringify(attributes)}`)
        return this.repository.findBy(attributes)
            .then(clienteEntities => {
                this.logger.debug(`Consulta de cliente realizada com sucesso com os parâmetros: '${JSON.stringify(attributes)}'`)
                return clienteEntities.map(clienteEntity => new Cliente(
                    clienteEntity.nome,
                    clienteEntity.email,
                    clienteEntity.cpf,
                    clienteEntity.id
                ));
            })
            .catch(error => {
                throw new RepositoryException(`Houve um erro ao buscar o cliete com os parâmetros: '${JSON.stringify(attributes)}': ${error.message}`)
            })
    }

    async save(cliente: Cliente): Promise<Cliente>{
        this.logger.debug(`Salvando cliente: ${cliente}`)
        return this.repository.save(cliente)
            .then(clienteEntity => {
                this.logger.debug(`Cliente salvo com sucesso no banco de dados: ${clienteEntity.id}`)
                return new Cliente(
                    clienteEntity.nome,
                    clienteEntity.email,
                    clienteEntity.cpf,
                    clienteEntity.id
                );
            })
            .catch(error => {
                throw new RepositoryException(`Houve um erro ao salvar o cliente no banco de dados: '${cliente}': ${error.message}`)
            })
    }
}