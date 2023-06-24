import { SalvarProdutoRequest } from './salvar-produto.request';
import { ApiProperty } from '@nestjs/swagger';

export class EditarProdutoRequest extends SalvarProdutoRequest {
   @ApiProperty({ required: true, nullable: false, description: 'Id cliente' })
   readonly id: number;
}
