import { ClienteIdentificado } from "src/enterprise/cliente/model/cliente-identificado.model";
import { Cliente } from "src/enterprise/cliente/model/cliente.model";
import { IService } from "src/enterprise/service/service";


export interface IClienteService extends IService<Cliente> {
   findByCpf(cpf: string): Promise<Cliente>;
   identifyByCpf(cpf: string): Promise<ClienteIdentificado>;
}
