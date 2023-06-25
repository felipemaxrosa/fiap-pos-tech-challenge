import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumberString, IsOptional, MaxLength } from 'class-validator';

export class IdentificaPorCpfClienteRequest {
   @ApiProperty({ required: false, nullable: true, description: 'CPF cliente' })
   @IsOptional()
   @IsNotEmpty({ message: 'Cpf não pode ser vazio' })
   @IsNumberString({}, { message: 'Cpf deve ser válido' })
   @MaxLength(11, { message: 'O cpf deve ter no máximo 11 caracteres' })
   public cpf: string;
}
