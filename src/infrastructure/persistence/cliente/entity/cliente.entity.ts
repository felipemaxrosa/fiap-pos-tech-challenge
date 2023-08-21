import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'CLIENTE' })
export class ClienteEntity {
   @PrimaryGeneratedColumn({ name: 'ID' })
   id: number;

   @Column({ name: 'NOME' })
   nome: string;

   @Column({ name: 'EMAIL' })
   email: string;

   @Column({ name: 'CPF' })
   cpf: string;
}
