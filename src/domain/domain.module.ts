import { Module } from '@nestjs/common';
import { Cliente } from './cliente/model/cliente.model';
import { ClienteService } from './cliente/service/cliente.service';
import { IRepository } from './repository/repository';
import { CpfUnicoClienteValidator } from './cliente/validation/cpf-unico-cliente.validator';
import { EmailUnicoClienteValidator } from './cliente/validation/email-unico-cliente.validator';
import { SalvarClienteValidator } from './cliente/validation/salvar-cliente.validator';

@Module({
    providers:[
        {provide: 'IService<Cliente>', useClass: ClienteService},
        {   
            provide: 'SalvarClienteValidator',
            inject: ['IRepository<Cliente>'],
            useFactory: (repository: IRepository<Cliente>): SalvarClienteValidator[] => [
                new EmailUnicoClienteValidator(repository),
                new CpfUnicoClienteValidator(repository),
            ]
        },
    ],
    exports:[
        {provide: 'IService<Cliente>', useClass: ClienteService},
    ]
})
export class DomainModule {}
