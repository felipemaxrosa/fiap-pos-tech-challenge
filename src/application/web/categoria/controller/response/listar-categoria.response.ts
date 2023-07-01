import { ApiProperty } from '@nestjs/swagger';
import { CategoriaProduto } from 'src/domain/categoria/model/categoria-produto.model';

export class ListarCategoriaResponse {
   @ApiProperty({ required: true, nullable: false, description: 'Nome da categoria' })
   public nome: string;

   @ApiProperty({ required: true, nullable: false, description: 'ID da categoria' })
   public id: number;

   constructor(categoriaProduto: CategoriaProduto) {
      this.id = categoriaProduto.id;
      this.nome = categoriaProduto.nome;
   }
}
