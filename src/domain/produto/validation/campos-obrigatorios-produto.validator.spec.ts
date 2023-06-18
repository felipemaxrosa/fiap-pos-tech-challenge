import { Test, TestingModule } from '@nestjs/testing';
import { Produto } from 'src/domain/produto/model/produto.model';
import { IRepository } from 'src/domain/repository/repository';
import { CamposObrigatoriosProdutoValidator } from './campos-obrigatorios-produto.validator';

// Stubs
const produtoCorreto: Produto = {
   id: 1,
   nome: 'nome correto',
   idCategoriaProduto: 1,
   descricao: 'Teste',
   preco: 10,
   imagemBase64: '',
   ativo: true,
};

const produtoComNomeInvalido: Produto = {
   id: 1,
   nome: ' ',
   idCategoriaProduto: 1,
   descricao: 'Teste',
   preco: 10,
   imagemBase64: '',
   ativo: true,
};

const produtoComPrecoInvalido: Produto = {
   id: 1,
   nome: ' ',
   idCategoriaProduto: 1,
   descricao: 'Teste',
   preco: -10,
   imagemBase64: '',
   ativo: true,
};

const produtoComIdCategoriaProdutoInvalido: Produto = {
   id: 1,
   nome: 'nome correto',
   idCategoriaProduto: 100,
   descricao: 'Teste',
   preco: 10,
   imagemBase64: '',
   ativo: true,
};

describe('CamposObrigatoriosProdutoValidator', () => {
   let validator: CamposObrigatoriosProdutoValidator;
   let repository: IRepository<Produto>;

   beforeEach(async () => {
      // Configuração do módulo de teste
      const module: TestingModule = await Test.createTestingModule({
         providers: [
            CamposObrigatoriosProdutoValidator,
            // Mock do serviço IRepository<Produto>
            {
               provide: 'IRepository<Produto>',
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

      // Obtém a instância do serviço e repositório a partir do módulo de teste
      repository = module.get<IRepository<Produto>>('IRepository<Produto>');
      validator = module.get<CamposObrigatoriosProdutoValidator>(CamposObrigatoriosProdutoValidator);
   });

   describe('injeção de dependências', () => {
      it('deve existir instância de repositório definida', async () => {
         expect(repository).toBeDefined();
      }); // end it deve existir instância de repositório definida
   }); // end describe injeção de dependências

   describe('validate', () => {
      it('deve validar positivamente produtos corretamente preenchidos', async () => {
         await validator.validate(produtoCorreto).then((validationResult) => {
            expect(validationResult).toBeTruthy();
         });
      }); // end it deve validar positivamente produtos corretamente preenchidos
      it('deve validar negativamente produtos sem nome válido', async () => {
         await expect(validator.validate(produtoComNomeInvalido)).rejects.toThrowError(
            CamposObrigatoriosProdutoValidator.CAMPOS_INVALIDOS_ERROR_MESSAGE,
         );
      }); // end it deve validar negativamente produtos sem nome válido
      it('deve validar negativamente produtos com preço negativo', async () => {
         await expect(validator.validate(produtoComPrecoInvalido)).rejects.toThrowError(
            CamposObrigatoriosProdutoValidator.CAMPOS_INVALIDOS_ERROR_MESSAGE,
         );
      }); // end it deve validar negativamente produtos com preço negativo
      it('deve validar negativamente produtos com idCategoriaProduto inválido', async () => {
         await expect(validator.validate(produtoComIdCategoriaProdutoInvalido)).rejects.toThrowError(
            CamposObrigatoriosProdutoValidator.ID_CATEGORIA_PRODUTO_INVALIDO_ERROR_MESSAGE,
         );
      }); // end it deve validar negativamente produtos com idCategoriaProduto inválido
   }); // end describe validate
}); // end describe CamposObrigatoriosProdutoValidator
