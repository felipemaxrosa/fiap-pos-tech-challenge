import { ApiProperty } from '@nestjs/swagger';

import { Produto } from '../../../../domain/produto/model/produto.model';

export class BuscaPorIdProdutoResponse {
   @ApiProperty({
      required: true,
      nullable: false,
      description: 'Nome do produto',
   })
   public nome: string;

   @ApiProperty({
      required: true,
      nullable: false,
      description: 'Id da categoria do produto',
   })
   public idCategoriaProduto: number;

   @ApiProperty({
      required: false,
      nullable: true,
      description: 'Descrição do produto',
   })
   public descricao: string;

   @ApiProperty({
      required: true,
      nullable: false,
      description: 'Preço do produto',
   })
   public preco: number;

   @ApiProperty({
      required: false,
      nullable: true,
      description: 'Imagem do produto',
   })
   public imagemBase64: string;

   @ApiProperty({
      required: false,
      nullable: true,
      description: 'Ativo',
      default: true,
   })
   public ativo: boolean;

   @ApiProperty({ required: true, nullable: false, description: 'ID do produto' })
   public id: number;

   constructor(produto: Produto) {
      this.nome = produto.nome;
      this.idCategoriaProduto = produto.idCategoriaProduto;
      this.descricao = produto.descricao;
      this.preco = produto.preco;
      this.imagemBase64 = produto.imagemBase64;
      this.id = produto.id;
      this.ativo = produto.ativo;
   }
}
