import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumberString, MaxLength } from 'class-validator';

export class BuscarPorCpfClienteRequest {
   @ApiProperty({ required: true, nullable: false, description: 'CPF do cliente' })
   @IsNotEmpty({ message: 'CPF não pode ser vazio' })
   @IsNumberString({}, { message: 'CPF deve ser válido' })
   @MaxLength(11, { message: 'O cpf deve ter no máximo 11 caracteres' })
   public cpf: string;
}
