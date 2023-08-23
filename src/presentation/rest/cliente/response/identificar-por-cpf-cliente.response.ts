import { ApiProperty } from '@nestjs/swagger';
import { ClienteIdentificado } from 'src/enterprise/cliente/model/cliente-identificado.model';

export class IdentificarPorCpfClienteResponse {
   @ApiProperty({ required: false, nullable: true, description: 'Nome do cliente' })
   public nome: string;

   @ApiProperty({ required: false, nullable: true, description: 'Email do cliente' })
   public email: string;

   @ApiProperty({ required: false, nullable: true, description: 'CPF do cliente' })
   public cpf: string;

   @ApiProperty({ required: false, nullable: true, description: 'ID do cliente' })
   public id: number;

   @ApiProperty({ required: false, nullable: true, description: 'Cliente anônimo' })
   public anonimo: boolean;

   constructor(cliente: ClienteIdentificado) {
      this.nome = cliente.nome;
      this.email = cliente.email;
      this.cpf = cliente.cpf;
      this.id = cliente.id;
      this.anonimo = cliente.anonimo;
   }
}
