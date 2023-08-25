import { Inject, Injectable } from '@nestjs/common';
import { IClienteService } from 'src/application/cliente/service/cliente.service.interface';
import { ClienteIdentificado } from 'src/enterprise/cliente/model/cliente-identificado.model';
import { Cliente } from 'src/enterprise/cliente/model/cliente.model';

import { ClienteConstants } from 'src/shared/constants';
import { BuscarClientePorCpfUsecase } from 'src/application/cliente/usecase/buscar-cliente-por-cpf.usecase';
import { SalvarClienteUseCase } from 'src/application/cliente/usecase/salvar-cliente.usecase';
import { IdentificarClienteUseCase } from 'src/application/cliente/usecase/identificar-cliente-por-cpf.usecase';

@Injectable()
export class ClienteService implements IClienteService {
   constructor(
      @Inject(ClienteConstants.BUSCAR_CLIENTE_POR_CPF_USECASE) private buscarUsecase: BuscarClientePorCpfUsecase,
      @Inject(ClienteConstants.SALVAR_CLIENTE_USECASE) private salvarUsecase: SalvarClienteUseCase,
      @Inject(ClienteConstants.IDENTIFICAR_CLIENTE_POR_CPF_USECASE)
      private identificarUsecase: IdentificarClienteUseCase,
   ) {}

   async findByCpf(cpf: string): Promise<Cliente> {
      return await this.buscarUsecase.buscarClientePorCpf(cpf);
   }

   async save(cliente: Cliente): Promise<Cliente> {
      return await this.salvarUsecase.salvarCliente(cliente);
   }

   async identifyByCpf(cpf: string): Promise<ClienteIdentificado> {
      return await this.identificarUsecase.identificarClientePorCpf(cpf);
   }
}
