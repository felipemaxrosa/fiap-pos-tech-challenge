import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumberString, IsOptional, MaxLength } from 'class-validator';

export class IdentificarPorCpfClienteRequest {
   @ApiProperty({ required: false, nullable: true, description: 'CPF do cliente' })
   @IsOptional()
   @IsNotEmpty({ message: 'CPF não pode ser vazio' })
   @IsNumberString({}, { message: 'CPF deve ser válido' })
   @MaxLength(11, { message: 'O cpf deve ter no máximo 11 caracteres' })
   public cpf: string;
}
