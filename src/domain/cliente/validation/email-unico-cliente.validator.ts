import { Inject, Injectable, Logger } from '@nestjs/common';
import { SalvarClienteValidator } from './salvar-cliente.validator';
import { ValidationException } from 'src/domain/exception/validation.exception';
import { Cliente } from '../model/cliente.model';
import { IRepository } from 'src/domain/repository/repository';

@Injectable()
export class EmailUnicoClienteValidator implements SalvarClienteValidator {
  public static EMAIL_UNICO_CLIENTE_VALIDATOR_ERROR_MESSAGE =
    'O email do cliente não é único';

  private logger: Logger = new Logger(EmailUnicoClienteValidator.name);

  constructor(
    @Inject('IRepository<Cliente>') private repository: IRepository<Cliente>,
  ) {}

  async validate(cliente: Cliente): Promise<boolean> {
    this.logger.log(
      `Inicializando validação ${EmailUnicoClienteValidator.name} para salvar o cliente: ${cliente.email}`,
    );

    return this.repository.findBy({ email: cliente.email }).then((clients) => {
      if (clients.length > 0) {
        this.logger.error(
          `Cliente já existente na base de dados com o email: ${cliente.email}`,
        );
        throw new ValidationException(
          EmailUnicoClienteValidator.EMAIL_UNICO_CLIENTE_VALIDATOR_ERROR_MESSAGE,
        );
      }

      this.logger.debug(
        `${EmailUnicoClienteValidator.name} finalizado com sucesso para cliente: ${cliente.email}`,
      );
      return true;
    });
  }
}
