import { Test, TestingModule } from '@nestjs/testing';
import { BuscarClientePorCpfUseCase } from './buscar-cliente-por-cpf.usecase';
import { BuscarClienteValidator } from 'src/application/cliente/validation/buscar-cliente.validator';
import { Cliente } from 'src/enterprise/cliente/model/cliente.model';
import { ServiceException } from 'src/enterprise/exception/service.exception';
import { IRepository } from 'src/enterprise/repository/repository';
import { ClienteConstants } from 'src/shared/constants';
import { ClienteProviders } from 'src/application/cliente/providers/cliente.providers';
import { PersistenceInMemoryProviders } from 'src/infrastructure/persistence/providers/persistence-in-memory.providers';

describe('BuscarClientePorCpfUseCase', () => {
   let useCase: BuscarClientePorCpfUseCase;
   let repository: IRepository<Cliente>;
   let buscarValidators: BuscarClienteValidator[];

   const clienteMock: Cliente = {
      id: 1,
      nome: 'John Doe',
      email: 'johndoe@example.com',
      cpf: '25634428777',
   };

   beforeEach(async () => {
      // Configuração do módulo de teste
      const module: TestingModule = await Test.createTestingModule({
         providers: [...ClienteProviders, ...PersistenceInMemoryProviders],
      }).compile();

      // Desabilita a saída de log
      module.useLogger(false);

      useCase = module.get<BuscarClientePorCpfUseCase>(ClienteConstants.BUSCAR_CLIENTE_POR_CPF_USECASE);
      repository = module.get<IRepository<Cliente>>(ClienteConstants.IREPOSITORY);
      buscarValidators = module.get<BuscarClienteValidator[]>(ClienteConstants.BUSCAR_CLIENTE_VALIDATOR);
   });

   describe('injeção de dependências', () => {
      it('deve existir instâncias definidas', async () => {
         expect(repository).toBeDefined();
         expect(buscarValidators).toBeDefined();
      });
   });

   describe('buscarClientePorCpf', () => {
      it('deve buscar um cliente por CPF com sucesso', async () => {
         jest.spyOn(repository, 'findBy').mockResolvedValue([clienteMock]);

         const result = await useCase.buscarClientePorCpf(clienteMock.cpf);

         expect(result).toEqual(clienteMock);
      });

      it('deve lançar uma ServiceException em caso de erro no repositório', async () => {
         const error = new Error('Erro no repositório');
         jest.spyOn(repository, 'findBy').mockRejectedValue(error);

         await expect(useCase.buscarClientePorCpf(clienteMock.cpf)).rejects.toThrowError(ServiceException);
      });

      it('deve executar os validadores antes de buscar o cliente', async () => {
         const mockValidator: BuscarClienteValidator = {
            validate: jest.fn(),
         };
         const cpf = clienteMock.cpf;
         const clientWithCpf = new Cliente(undefined, undefined, cpf);

         jest.spyOn(repository, 'findBy').mockResolvedValue([clienteMock]);
         buscarValidators.push(mockValidator);

         await useCase.buscarClientePorCpf(cpf);

         expect(mockValidator.validate).toHaveBeenCalledWith(clientWithCpf);
      });
   });
});
