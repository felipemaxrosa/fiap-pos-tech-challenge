import { Test, TestingModule } from '@nestjs/testing';
import { Cliente } from 'src/enterprise/cliente/model/cliente.model';
import { EmailValidoClienteValidator } from 'src/application/cliente/validation/email-valido-cliente.validator';

describe('EmailValidoClienteValidator', () => {
   let validator: EmailValidoClienteValidator;

   const cliente: Cliente = {
      id: 1,
      nome: 'Teste',
      email: 'teste@teste.com',
      cpf: '25634428777',
   };

   beforeEach(async () => {
      // Configuração do módulo de teste
      const module: TestingModule = await Test.createTestingModule({
         providers: [EmailValidoClienteValidator],
      }).compile();

      // Desabilita a saída de log
      module.useLogger(false);

      validator = module.get<EmailValidoClienteValidator>(EmailValidoClienteValidator);
   });

   describe('validate', () => {
      it('deve validar cliente com email valido', async () => {
         await validator.validate(cliente).then((result) => {
            expect(result).toBeTruthy();
         });
      });

      it('deve validar cliente com email inválido', async () => {
         cliente.email = 'emailinvalido';
         await expect(validator.validate(cliente)).rejects.toThrowError(
            EmailValidoClienteValidator.EMAIL_VALIDO_CLIENTE_VALIDATOR_ERROR_MESSAGE,
         );
      });
   });
});
