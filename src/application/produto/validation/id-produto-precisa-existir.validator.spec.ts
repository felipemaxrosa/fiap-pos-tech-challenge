import { Test, TestingModule } from '@nestjs/testing';
import { IdProdutoPrecisaExistirValidator } from 'src/application/produto/validation/id-produto-precisa-existir.validator';
import { ValidationException } from 'src/enterprise/exception/validation.exception';
import { Produto } from 'src/enterprise/produto/model/produto.model';
import { IRepository } from 'src/enterprise/repository/repository';
import { ProdutoConstants } from 'src/shared/constants';

describe('IdProdutoPrecisaExistirValidator', () => {
   let idProdutoPrecisaExistirValidator: IdProdutoPrecisaExistirValidator;
   let repository: IRepository<Produto>;

   const produtoComIdValido: Produto = {
      id: 1,
      nome: 'Produto Único',
      idCategoriaProduto: 1,
      descricao: 'Descrição do Produto Único',
      preco: 50.0,
      imagemBase64: 'ImagemBase64',
      ativo: true,
   };

   const produtoComIdInexistente: Produto = {
      id: 1000001,
      nome: 'Produto Único',
      idCategoriaProduto: 1,
      descricao: 'Descrição do Produto Único',
      preco: 50.0,
      imagemBase64: 'ImagemBase64',
      ativo: true,
   };

   beforeEach(async () => {
      const module: TestingModule = await Test.createTestingModule({
         providers: [
            IdProdutoPrecisaExistirValidator,
            {
               provide: ProdutoConstants.IREPOSITORY,
               useValue: {
                  findBy: jest.fn(() => {
                     // retorna vazio, simulando que não encontrou registros pelo atributos passados por parâmetro
                     return Promise.resolve({});
                  }),
               },
            },
         ],
      }).compile();

      // Desabilita a saída de log
      module.useLogger(false);

      repository = module.get<IRepository<Produto>>(ProdutoConstants.IREPOSITORY);
      idProdutoPrecisaExistirValidator = module.get<IdProdutoPrecisaExistirValidator>(IdProdutoPrecisaExistirValidator);
   });

   it('deve ser definido', () => {
      expect(idProdutoPrecisaExistirValidator).toBeDefined();
      expect(repository).toBeDefined();
   });

   it('deve aceitar modificação se o id do produto existir', async () => {
      // Simule o método findBy do repositório para retornar um array vazio (sem produtos existentes com o mesmo nome)
      repository.findBy = jest.fn().mockResolvedValue([produtoComIdValido]);

      const resultado = await idProdutoPrecisaExistirValidator.validate(produtoComIdValido);
      expect(resultado).toBe(true);

      // Verifique se o método findBy foi chamado com os argumentos corretos
      expect(repository.findBy).toHaveBeenCalledWith({ id: produtoComIdValido.id });
   });

   it('deve lançar ValidationException para um id inexistente', async () => {
      // Simule o método findBy do repositório para retornar um array com um produto existente
      repository.findBy = jest.fn().mockResolvedValue([]);

      try {
         await idProdutoPrecisaExistirValidator.validate(produtoComIdInexistente);
         // Se a validação passar, esta linha não deve ser executada
         expect(true).toBe(false);
      } catch (error) {
         expect(error).toBeInstanceOf(ValidationException);
         expect(error.message).toBe(IdProdutoPrecisaExistirValidator.ID_INEXISTENTE_ERROR_MESSAGE);
      }
   });
});
