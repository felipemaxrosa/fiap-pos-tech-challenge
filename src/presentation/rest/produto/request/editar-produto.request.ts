import { ApiProperty } from '@nestjs/swagger';
import { SalvarProdutoRequest } from 'src/presentation/rest/produto/request/salvar-produto.request';

export class EditarProdutoRequest extends SalvarProdutoRequest {
   @ApiProperty({ required: true, nullable: false, description: 'Id cliente' })
   readonly id: number;
}
