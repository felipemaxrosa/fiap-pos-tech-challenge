import { Inject, Injectable } from '@nestjs/common';
import { ClienteIdentificado } from 'src/enterprise/cliente/model/cliente-identificado.model';
import { ClienteConstants } from 'src/shared/constants';
import { BuscarClientePorCpfUseCase } from 'src/application/cliente/usecase/buscar-cliente-por-cpf.usecase';

@Injectable()
export class IdentificarClienteUseCase {
   constructor(
      @Inject(ClienteConstants.BUSCAR_CLIENTE_POR_CPF_USECASE) private buscarUsecase: BuscarClientePorCpfUseCase,
   ) {}

   async identificarClientePorCpf(cpf: string): Promise<ClienteIdentificado> {
      if (cpf === undefined) {
         return Promise.resolve(new ClienteIdentificado(undefined));
      }

      return await this.buscarUsecase.buscarClientePorCpf(cpf).then((cliente) => {
         return new ClienteIdentificado(cliente);
      });
   }
}
