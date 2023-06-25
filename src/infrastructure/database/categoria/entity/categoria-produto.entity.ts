import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity({ name: 'CATEGORIA_PRODUTO' })
export class CategoriaProdutoEntity {
   @PrimaryColumn({ name: 'ID' })
   id: number;

   @Column({ name: 'NOME' })
   nome: string;
}
