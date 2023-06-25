import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumberString, MaxLength } from 'class-validator';

export class BuscarPorCpfClienteRequest {
   @ApiProperty({ required: true, nullable: false, description: 'CPF cliente' })
   @IsNotEmpty({ message: 'Cpf não pode ser vazio' })
   @IsNumberString({}, { message: 'Cpf deve ser válido' })
   @MaxLength(11, { message: 'O cpf deve ter no máximo 11 caracteres' })
   public cpf: string;
}
