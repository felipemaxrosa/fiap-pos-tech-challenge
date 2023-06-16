import { Injectable, Logger } from '@nestjs/common';
import { Cliente } from '../../../../domain/cliente/model/cliente.model';
import { IRepository } from '../../../../domain/repository/repository';
import { ClienteEntity } from '../entity/cliente.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { RepositoryException } from '../../../exception/repository.exception';

@Injectable()
export class ClienteTypeormRepository implements IRepository<Cliente> {
  w;

  private logger: Logger = new Logger(ClienteTypeormRepository.name);

  constructor(
    @InjectRepository(ClienteEntity)
    private repository: Repository<ClienteEntity>,
  ) {}

  async findBy(attributes: any): Promise<Cliente[]> {
    this.logger.debug(
      `Realizando consulta de cliente: com os parâmetros ${JSON.stringify(
        attributes,
      )}`,
    );
    return this.repository
      .findBy(attributes)
      .then((clienteEntities) => {
        this.logger.debug(
          `Consulta de cliente realizada com sucesso com os parâmetros: '${JSON.stringify(
            attributes,
          )}'`,
        );
        return clienteEntities.map((clienteEntity) => ({
          id: clienteEntity.id,
          nome: clienteEntity.nome,
          email: clienteEntity.email,
          cpf: clienteEntity.cpf,
        }));
      })
      .catch((error) => {
        throw new RepositoryException(
          `Houve um erro ao buscar o cliente com os parâmetros: '${JSON.stringify(
            attributes,
          )}': ${error.message}`,
        );
      });
  }

  async save(cliente: Cliente): Promise<Cliente> {
    this.logger.debug(`Salvando cliente: ${cliente}`);
    return this.repository
      .save({
        nome: cliente.nome,
        email: cliente.email,
        cpf: cliente.cpf,
      })
      .then((clienteEntity) => {
        this.logger.debug(
          `Cliente salvo com sucesso no banco de dados: ${clienteEntity.id}`,
        );
        return {
          id: clienteEntity.id,
          nome: clienteEntity.nome,
          email: clienteEntity.email,
          cpf: clienteEntity.cpf,
        };
      })
      .catch((error) => {
        throw new RepositoryException(
          `Houve um erro ao salvar o cliente no banco de dados: '${cliente}': ${error.message}`,
        );
      });
  }
}
