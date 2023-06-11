import { Cliente } from "../model/cliente.model";
import { IValidator } from "../../validation/validator";

export interface SalvarClienteValidator extends IValidator<Cliente> {
}
