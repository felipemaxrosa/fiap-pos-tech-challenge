import { IService } from 'src/domain/service/service';
import { Cliente } from '../model/cliente.model';
import { ClienteIdentificado } from '../model/cliente-identificado.model';

export interface IClienteService extends IService<Cliente> {
   findByCpf(cpf: string): Promise<Cliente>;
   identifyByCpf(cpf: string): Promise<ClienteIdentificado>;
}
