import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsNumberString, IsString, MaxLength } from 'class-validator';

export class SalvarClienteRequest {
   @ApiProperty({ required: true, nullable: false, description: 'Nome cliente' })
   @IsNotEmpty({ message: 'Nome não pode ser vazio' })
   @IsString({ message: 'Nome deve ser válido' })
   @MaxLength(255, { message: 'O nome deve ter no máximo 255 caracteres' })
   public nome: string;

   @ApiProperty({ required: true, nullable: false, description: 'Email cliente' })
   @IsNotEmpty({ message: 'Email não pode ser vazio' })
   @IsEmail({}, { message: 'Email deve ser válido' })
   @MaxLength(255, { message: 'O email deve ter no máximo 255 caracteres' })
   public email: string;

   @ApiProperty({ required: true, nullable: false, description: 'CPF cliente' })
   @IsNotEmpty({ message: 'Cpf não pode ser vazio' })
   @IsNumberString({}, { message: 'Cpf deve ser válido' })
   @MaxLength(11, { message: 'O cpf deve ter no máximo 11 caracteres' })
   public cpf: string;
}
