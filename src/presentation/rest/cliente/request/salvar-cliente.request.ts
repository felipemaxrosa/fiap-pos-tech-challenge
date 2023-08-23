import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsNumberString, IsString, MaxLength } from 'class-validator';

export class SalvarClienteRequest {
   @ApiProperty({ required: true, nullable: false, description: 'Nome do cliente' })
   @IsNotEmpty({ message: 'Nome não pode ser vazio' })
   @IsString({ message: 'Nome deve ser válido' })
   @MaxLength(255, { message: 'O nome deve ter no máximo 255 caracteres' })
   public nome: string;

   @ApiProperty({ required: true, nullable: false, description: 'Email do cliente' })
   @IsNotEmpty({ message: 'Email não pode ser vazio' })
   @IsEmail({}, { message: 'Email deve ser válido' })
   @MaxLength(255, { message: 'O email deve ter no máximo 255 caracteres' })
   public email: string;

   @ApiProperty({ required: true, nullable: false, description: 'CPF do cliente' })
   @IsNotEmpty({ message: 'CPF não pode ser vazio' })
   @IsNumberString({}, { message: 'CPF deve ser válido' })
   @MaxLength(11, { message: 'O cpf deve ter no máximo 11 caracteres' })
   public cpf: string;
}
