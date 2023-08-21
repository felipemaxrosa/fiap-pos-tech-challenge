import { Cliente } from 'src/enterprise/cliente/model/cliente.model';

export class ClienteIdentificado {
   public nome: string;
   public email: string;
   public cpf: string;
   public id: number;
   public anonimo: boolean;

   constructor(cliente?: Cliente) {
      if (cliente) {
         this.nome = cliente.nome;
         this.email = cliente.email;
         this.cpf = cliente.cpf;
         this.id = cliente.id;
      } else {
         this.anonimo = true;
      }
   }
}
