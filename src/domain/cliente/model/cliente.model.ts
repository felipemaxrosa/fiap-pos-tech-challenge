export class Cliente {
  constructor(
    public nome: string,
    public email: string,
    public cpf: string,
    public id?: number,
  ) {}
}
