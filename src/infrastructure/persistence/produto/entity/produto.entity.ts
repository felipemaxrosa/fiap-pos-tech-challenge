import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'PRODUTO' })
export class ProdutoEntity {
   @PrimaryGeneratedColumn({ name: 'ID' })
   id: number;

   @Column({ name: 'PRODUTO_CATEGORIA_ID' })
   idCategoriaProduto: number;

   @Column({ name: 'NOME' })
   nome: string;

   @Column({ name: 'DESCRICAO' })
   descricao: string;

   @Column({ name: 'PRECO' })
   preco: number;

   @Column({ name: 'IMAGEM' })
   imagemBase64: string;

   @Column({ name: 'ATIVO' })
   ativo: boolean;
}
