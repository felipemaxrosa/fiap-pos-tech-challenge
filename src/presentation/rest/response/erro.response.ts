import { ApiProperty } from '@nestjs/swagger';

export class ErroResponse {
   @ApiProperty({ required: true, nullable: false, description: 'Http status code' })
   public status: number;

   @ApiProperty({ required: true, nullable: false, description: 'Mensagem de erro' })
   public message: string;

   @ApiProperty({ required: true, nullable: false, description: 'Timestamp da requisição' })
   public timestamp: string;

   @ApiProperty({ required: true, nullable: false, description: 'Path da requisição' })
   public path: string;
}
