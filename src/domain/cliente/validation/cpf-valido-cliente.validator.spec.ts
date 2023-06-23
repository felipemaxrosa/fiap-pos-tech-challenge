import { Test, TestingModule } from '@nestjs/testing';
import { Cliente } from 'src/domain/cliente/model/cliente.model';
import { CpfValidoClienteValidator } from './cpf-valido-cliente.validator';

describe('CpfValidoClienteValidator', () => {
   let validator: CpfValidoClienteValidator;

   const cliente: Cliente = {
      id: 1,
      nome: 'Teste',
      email: 'teste@teste.com',
      cpf: '25634428777',
   };

   beforeEach(async () => {
      // Configuração do módulo de teste
      const module: TestingModule = await Test.createTestingModule({
         providers: [CpfValidoClienteValidator],
      }).compile();

      // Desabilita a saída de log
      module.useLogger(false);

      validator = module.get<CpfValidoClienteValidator>(CpfValidoClienteValidator);
   });

   describe('validate', () => {
      it('deve validar cliente com cpf valido', async () => {
         await validator.validate(cliente).then((result) => {
            expect(result).toBeTruthy();
         });
      });

      it('deve validar cliente com cpf inválido', async () => {
         cliente.cpf = '12345678901';
         await expect(validator.validate(cliente)).rejects.toThrowError(
            CpfValidoClienteValidator.CPF_VALIDO_CLIENTE_VALIDATOR_ERROR_MESSAGE,
         );
      });
   });
});
