import { Test, TestingModule } from '@nestjs/testing';
import { Cliente } from 'src/enterprise/cliente/model/cliente.model';
import { EmailUnicoClienteValidator } from 'src/enterprise/cliente/validation/email-unico-cliente.validator';
import { IRepository } from 'src/enterprise/repository/repository';
import { ClienteConstants } from 'src/shared/constants';

describe('EmailUnicoClienteValidator', () => {
   let validator: EmailUnicoClienteValidator;
   let repository: IRepository<Cliente>;

   const cliente: Cliente = {
      id: 1,
      nome: 'Teste',
      email: 'teste@teste.com',
      cpf: '25634428777',
   };

   beforeEach(async () => {
      // Configuração do módulo de teste
      const module: TestingModule = await Test.createTestingModule({
         providers: [
            EmailUnicoClienteValidator,
            // Mock do serviço IRepository<Cliente>
            {
               provide: ClienteConstants.IREPOSITORY,
               useValue: {
                  findBy: jest.fn(() => {
                     // retorna vazio, sumulando que não encontrou registros pelo atributos passados por parâmetro
                     return Promise.resolve({});
                  }),
               },
            },
         ],
      }).compile();

      // Desabilita a saída de log
      module.useLogger(false);

      // Obtém a instância do serviço e repositório a partir do módulo de teste
      repository = module.get<IRepository<Cliente>>(ClienteConstants.IREPOSITORY);
      validator = module.get<EmailUnicoClienteValidator>(EmailUnicoClienteValidator);
   });

   describe('injeção de dependências', () => {
      it('deve existir instância de repositório definida', async () => {
         expect(repository).toBeDefined();
      });
   });

   describe('validate', () => {
      it('deve validar cliente com email único', async () => {
         const repositorySpy = jest.spyOn(repository, 'findBy');

         await validator.validate(cliente).then((unique) => {
            expect(unique).toBeTruthy();
         });

         expect(repositorySpy).toHaveBeenCalledWith({ email: cliente.email });
      });

      it('deve validar cliente com email não-único', async () => {
         // mock de repositório retornando um cliente
         repository.findBy = jest.fn().mockImplementation(() => {
            return Promise.resolve([cliente]);
         });

         await expect(validator.validate(cliente)).rejects.toThrowError(
            EmailUnicoClienteValidator.EMAIL_UNICO_CLIENTE_VALIDATOR_ERROR_MESSAGE,
         );
      });
   });
});
