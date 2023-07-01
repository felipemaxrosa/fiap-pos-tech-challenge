import { ApiProperty } from '@nestjs/swagger';
import { Cliente } from 'src/domain/cliente/model/cliente.model';

export class SalvarClienteResponse {
   @ApiProperty({ required: true, nullable: false, description: 'Nome do cliente' })
   public nome: string;

   @ApiProperty({ required: true, nullable: false, description: 'Email do cliente' })
   public email: string;

   @ApiProperty({ required: true, nullable: false, description: 'CPF do cliente' })
   public cpf: string;

   @ApiProperty({ required: true, nullable: false, description: 'ID do cliente' })
   public id: number;

   constructor(cliente: Cliente) {
      this.nome = cliente.nome;
      this.email = cliente.email;
      this.cpf = cliente.cpf;
      this.id = cliente.id;
   }
}
