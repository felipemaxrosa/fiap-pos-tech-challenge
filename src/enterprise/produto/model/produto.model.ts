export class Produto {
   constructor(
      public nome: string,
      public idCategoriaProduto: number,
      public descricao: string,
      public preco: number,
      public imagemBase64: string,
      public ativo: boolean,
      public id?: number,
   ) {}
}
