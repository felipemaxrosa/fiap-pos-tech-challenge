import { Module } from '@nestjs/common';

import { Cliente } from './cliente/model/cliente.model';
import { ClienteService } from './cliente/service/cliente.service';
import { IRepository } from './repository/repository';
import { CpfUnicoClienteValidator } from './cliente/validation/cpf-unico-cliente.validator';
import { EmailUnicoClienteValidator } from './cliente/validation/email-unico-cliente.validator';
import { SalvarClienteValidator } from './cliente/validation/salvar-cliente.validator';
import { PedidoService } from './pedido/service/pedido.service';
import { CriarNovoPedidoValidator } from './pedido/validation/criar-novo-pedido.validator';
import { EstadoCorretoNovoPedidoValidator } from './pedido/validation/estado-correto-novo-pedido.validator';
import { PedidoConstants } from 'src/shared/constants';

@Module({
   providers: [
      { provide: 'IService<Cliente>', useClass: ClienteService },
      {
         provide: 'SalvarClienteValidator',
         inject: ['IRepository<Cliente>'],
         useFactory: (repository: IRepository<Cliente>): SalvarClienteValidator[] => [
            new EmailUnicoClienteValidator(repository),
            new CpfUnicoClienteValidator(repository),
         ],
      },
      { provide: PedidoConstants.ISERVICE, useClass: PedidoService },
      {
         provide: 'CriarNovoPedidoValidator',
         inject: [PedidoConstants.IREPOSITORY],
         useFactory: (): CriarNovoPedidoValidator[] => [new EstadoCorretoNovoPedidoValidator()],
      },
   ],
   exports: [
      { provide: 'IService<Cliente>', useClass: ClienteService },
      { provide: PedidoConstants.ISERVICE, useClass: PedidoService },
   ],
})
export class DomainModule {}
