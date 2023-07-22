import { Test, TestingModule } from '@nestjs/testing';

import { ClienteConstants } from '../../../shared/constants';
import { IRepository } from '../../../domain/repository/repository';
import { Cliente } from '../../../domain/cliente/model/cliente.model';
import { CpfUnicoClienteValidator } from '../validation/cpf-unico-cliente.validator';

describe('CpfUnicoClienteValidator', () => {
   let validator: CpfUnicoClienteValidator;
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
            CpfUnicoClienteValidator,
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
      validator = module.get<CpfUnicoClienteValidator>(CpfUnicoClienteValidator);
   });

   describe('injeção de dependências', () => {
      it('deve existir instância de repositório definida', async () => {
         expect(repository).toBeDefined();
      });
   });

   describe('validate', () => {
      it('deve validar cliente com cpf único', async () => {
         const repositorySpy = jest.spyOn(repository, 'findBy');

         await validator.validate(cliente).then((unique) => {
            expect(unique).toBeTruthy();
         });

         expect(repositorySpy).toHaveBeenCalledWith({ cpf: cliente.cpf });
      });

      it('deve validar cliente com cpf não-único', async () => {
         // mock de repositório retornando um cliente
         repository.findBy = jest.fn().mockImplementation(() => {
            return Promise.resolve([cliente]);
         });

         await expect(validator.validate(cliente)).rejects.toThrowError(
            CpfUnicoClienteValidator.CPF_UNICO_CLIENTE_VALIDATOR_ERROR_MESSAGE,
         );
      });
   });
});
