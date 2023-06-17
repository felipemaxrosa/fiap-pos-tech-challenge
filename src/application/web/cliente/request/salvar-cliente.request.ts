import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsNumberString, IsString } from 'class-validator';

export class SalvarClienteRequest {
  @ApiProperty({ required: true, nullable: false, description: 'Nome cliente' })
  @IsNotEmpty({ message: 'Nome não pode ser vazio' })
  @IsString({ message: 'Nome deve ser válido' })
  public nome: string;

  @ApiProperty({
    required: true,
    nullable: false,
    description: 'Email cliente',
  })
  @IsNotEmpty({ message: 'Email não pode ser vazio' })
  @IsEmail({}, { message: 'Email deve ser válido' })
  public email: string;

  @ApiProperty({ required: true, nullable: false, description: 'CPF cliente' })
  @IsNotEmpty({ message: 'Cpf não pode ser vazio' })
  @IsNumberString({}, { message: 'Cpf deve ser válido' })
  public cpf: string;
}
