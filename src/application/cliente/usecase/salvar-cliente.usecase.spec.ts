import { Test, TestingModule } from '@nestjs/testing';
import { SalvarClienteUseCase } from './salvar-cliente.usecase';
import { SalvarClienteValidator } from 'src/application/cliente/validation/salvar-cliente.validator';
import { Cliente } from 'src/enterprise/cliente/model/cliente.model';
import { ServiceException } from 'src/enterprise/exception/service.exception';
import { IRepository } from 'src/enterprise/repository/repository';
import { ClienteConstants } from 'src/shared/constants';
import { ClienteProviders } from 'src/application/cliente/providers/cliente.providers';
import { PersistenceInMemoryProviders } from 'src/infrastructure/persistence/providers/persistence-in-memory.providers';

describe('SalvarClienteUseCase', () => {
   let useCase: SalvarClienteUseCase;
   let repository: IRepository<Cliente>;
   let salvarValidators: SalvarClienteValidator[];

   const clienteMock: Cliente = {
      nome: 'John Doe',
      email: 'johndoe@example.com',
      cpf: '25634428777',
   };

   beforeEach(async () => {
      const module: TestingModule = await Test.createTestingModule({
         providers: [...ClienteProviders, ...PersistenceInMemoryProviders],
      }).compile();

      useCase = module.get<SalvarClienteUseCase>(ClienteConstants.SALVAR_CLIENTE_USECASE);
      repository = module.get<IRepository<Cliente>>(ClienteConstants.IREPOSITORY);
      salvarValidators = module.get<SalvarClienteValidator[]>(ClienteConstants.SALVAR_CLIENTE_VALIDATOR);
   });

   describe('injeção de dependências', () => {
      it('deve existir instâncias definidas', async () => {
         expect(repository).toBeDefined();
         expect(salvarValidators).toBeDefined();
      });
   });

   describe('salvarCliente', () => {
      it('deve salvar um cliente com sucesso', async () => {
         jest.spyOn(repository, 'save').mockResolvedValue(clienteMock);

         const result = await useCase.salvarCliente(clienteMock);

         expect(result).toEqual(clienteMock);
      });

      it('deve lançar uma ServiceException em caso de erro no repositório', async () => {
         const error = new Error('Erro no repositório');
         jest.spyOn(repository, 'save').mockRejectedValue(error);

         await expect(useCase.salvarCliente(clienteMock)).rejects.toThrowError(ServiceException);
      });

      it('deve executar os validadores antes de salvar o cliente', async () => {
         const mockValidator: SalvarClienteValidator = {
            validate: jest.fn(),
         };

         jest.spyOn(repository, 'save').mockResolvedValue(clienteMock);
         salvarValidators.push(mockValidator);

         await useCase.salvarCliente(clienteMock);

         expect(mockValidator.validate).toHaveBeenCalledWith(clienteMock);
      });
   });
});
