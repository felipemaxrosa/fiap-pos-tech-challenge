import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class SalvarProdutoRequest {
   @ApiProperty({
      required: true,
      nullable: false,
      description: 'Nome do produto',
   })
   @IsNotEmpty({ message: 'Nome não pode ser vazio' })
   @IsString({ message: 'Nome deve ser válido' })
   public nome: string;

   @ApiProperty({
      required: true,
      nullable: false,
      description: 'Id da categoria do produto',
   })
   @IsNotEmpty({ message: 'Id da categoria do produto não pode ser vazio' })
   @IsNumber({}, { message: 'Id da categoria deve ser válido' })
   public idCategoriaProduto: number;

   @ApiProperty({
      required: false,
      nullable: true,
      description: 'Descrição do produto',
   })
   @IsString({ message: 'Descrição deve ser válida' })
   public descricao: string;

   @ApiProperty({
      required: true,
      nullable: false,
      description: 'Preço do produto',
   })
   @IsNotEmpty({ message: 'Preço não pode ser vazio' })
   //@IsCurrency({}, { message: 'Preço deve ser válido' })
   public preco: number;

   @ApiProperty({
      required: false,
      nullable: true,
      description: 'Imagem do produto',
   })
   //@IsBase64({ message: 'Imagem deve ser padrão base64' })
   public imagemBase64: string;

   @ApiProperty({
      required: false,
      nullable: true,
      description: 'Ativo',
      default: true,
   })
   //@IsBoolean({ message: 'Ativo deve ser booleano' })
   public ativo: boolean;
}
