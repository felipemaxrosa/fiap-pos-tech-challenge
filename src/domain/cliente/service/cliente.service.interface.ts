import { IService } from "src/domain/service/service";
import { Cliente } from "../model/cliente.model";

export interface IClienteService extends IService<Cliente>{
    findByCpf(cpf: string): Promise<Cliente>
}