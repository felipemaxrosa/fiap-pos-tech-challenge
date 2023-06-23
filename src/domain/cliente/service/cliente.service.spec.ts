import { Test, TestingModule } from '@nestjs/testing';
import { Cliente } from 'src/domain/cliente/model/cliente.model';
import { SalvarClienteValidator } from '../validation/salvar-cliente.validator';
import { IRepository } from 'src/domain/repository/repository';
import { IService } from 'src/domain/service/service';
import { ClienteService } from './cliente.service';
import { EmailUnicoClienteValidator } from '../validation/email-unico-cliente.validator';
import { CpfUnicoClienteValidator } from '../validation/cpf-unico-cliente.validator';
import { RepositoryException } from 'src/infrastructure/exception/repository.exception';
import { ServiceException } from 'src/domain/exception/service.exception';
import { IClienteService } from './cliente.service.interface';
import { BuscarClienteValidator } from '../validation/buscar-cliente.validator';
import { CpfValidoClienteValidator } from '../validation/cpf-valido-cliente.validator';
describe('CienteService', () => {
   let service: IClienteService;
   let repository: IRepository<Cliente>;
   let validators: SalvarClienteValidator[];

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
            //  IService<Cliente> provider
            {
               provide: 'IService<Cliente>',
               inject: ['IRepository<Cliente>', 'SalvarClienteValidator', 'BuscarClienteValidator'],
               useFactory: (
                  repository: IRepository<Cliente>,
                  salvarClienteValidator: SalvarClienteValidator[],
                  buscarClienteValidator: BuscarClienteValidator[],
               ): IService<Cliente> => {
                  return new ClienteService(repository, salvarClienteValidator, buscarClienteValidator);
               },
            },
            // Mock do serviço IRepository<Cliente>
            {
               provide: 'IRepository<Cliente>',
               useValue: {
                  // mock para a chamama repository.save(cliente)
                  save: jest.fn(() => Promise.resolve(cliente)),
                  // mock para a chamama repository.findBy(attributes)
                  findBy: jest.fn(() => {
                     // retorna vazio, sumulando que não encontrou registros pelo atributos passados por parâmetro
                     return Promise.resolve({});
                  }),
               },
            },
            // Mock do SalvarClienteValidator
            {
               provide: 'SalvarClienteValidator',
               inject: ['IRepository<Cliente>'],
               useFactory: (repository: IRepository<Cliente>): SalvarClienteValidator[] => {
                  return [
                     new CpfValidoClienteValidator(),
                     new EmailUnicoClienteValidator(repository),
                     new CpfUnicoClienteValidator(repository),
                  ];
               },
            },

            {
               provide: 'BuscarClienteValidator',
               inject: ['IRepository<Cliente>'],
               useFactory: (): BuscarClienteValidator[] => [new CpfValidoClienteValidator()],
            },
         ],
      }).compile();

      // Desabilita a saída de log
      module.useLogger(false);

      // Obtém a instância do repositório, validators e serviço a partir do módulo de teste
      repository = module.get<IRepository<Cliente>>('IRepository<Cliente>');
      validators = module.get<SalvarClienteValidator[]>('SalvarClienteValidator');
      service = module.get<IClienteService>('IService<Cliente>');
   });

   describe('injeção de dependências', () => {
      it('deve existir instâncias de repositório e validators definidas', async () => {
         expect(repository).toBeDefined();
         expect(validators).toBeDefined();
      });
   });

   describe('save', () => {
      it('deve salvar cliente', async () => {
         const cliente: Cliente = {
            nome: 'Teste',
            email: 'teste@teste.com',
            cpf: '25634428777',
         };

         await service.save(cliente).then((clienteSalvo) => {
            // verifica se o cliente salvo contém os mesmos dados passados como input
            expect(clienteSalvo.id).toEqual(1);
            expect(clienteSalvo.nome).toEqual(cliente.nome);
            expect(clienteSalvo.email).toEqual(cliente.email);
            expect(clienteSalvo.cpf).toEqual(cliente.cpf);
         });
      });

      it('não deve salvar cliente quando existir um cliente com email existente', async () => {
         const cliente: Cliente = {
            nome: 'Teste',
            email: 'teste@teste.com',
            cpf: '25634428777',
         };

         // mock de repositório retornando um cliente, caso exista o email
         repository.findBy = jest.fn().mockImplementation((attributes) => {
            return Promise.resolve(attributes['email'] === cliente.email ? [cliente] : {});
         });

         // verifica se foi lançada uma exception com a mensagem de validção de email único
         await expect(service.save(cliente)).rejects.toThrowError(
            EmailUnicoClienteValidator.EMAIL_UNICO_CLIENTE_VALIDATOR_ERROR_MESSAGE,
         );
      });

      it('não deve salvar cliente quando existir um cliente com cpf existente', async () => {
         const cliente: Cliente = {
            nome: 'Teste',
            email: 'teste@teste.com',
            cpf: '25634428777',
         };

         // mock de repositório retornando um cliente, caso exista o cpf
         repository.findBy = jest.fn().mockImplementation((attributes) => {
            return Promise.resolve(attributes['cpf'] === cliente.cpf ? [cliente] : {});
         });

         // verifica se foi lançada uma exception com a mensagem de validção de cpf único
         await expect(service.save(cliente)).rejects.toThrowError(
            CpfUnicoClienteValidator.CPF_UNICO_CLIENTE_VALIDATOR_ERROR_MESSAGE,
         );
      });

      it('não deve salvar cliente com cpf inválido', async () => {
         const cliente: Cliente = {
            nome: 'Teste',
            email: 'teste@teste.com',
            cpf: '12345678901',
         };

         repository.findBy = jest.fn().mockImplementation((attributes) => {
            return Promise.resolve(attributes['cpf'] === cliente.cpf ? [cliente] : {});
         });

         await expect(service.save(cliente)).rejects.toThrowError(
            CpfValidoClienteValidator.CPF_VALIDO_CLIENTE_VALIDATOR_ERROR_MESSAGE,
         );
      });

      it('não deve salvar cliente quando houver um erro de banco ', async () => {
         const error = new RepositoryException('Erro genérico de banco de dados');
         jest.spyOn(repository, 'save').mockRejectedValue(error);

         // verifiaca se foi lançada uma exception na camada de serviço
         await expect(service.save(cliente)).rejects.toThrowError(ServiceException);
      });
   });

   describe('buscaPorCpf', () => {
      it('deve buscar cliente por cpf', async () => {
         const cliente: Cliente = {
            id: 1,
            nome: 'Teste',
            email: 'teste@teste.com',
            cpf: '25634428777',
         };

         repository.findBy = jest.fn().mockImplementation(() => {
            return Promise.resolve([cliente]);
         });

         await service.findByCpf(cliente.cpf).then((clienteSalvo) => {
            expect(clienteSalvo).toEqual(cliente);
         });
      });

      it('não deve buscar cliente com cpf inexistente', async () => {
         // mock de repositório retornando um cliente, caso exista o email
         repository.findBy = jest.fn().mockImplementation(() => {
            return Promise.resolve([]);
         });

         await service.findByCpf('00000000191').then((cliente) => {
            expect(cliente).toBeUndefined();
         });
      });

      it('não deve buscar cliente com cpf inválido', async () => {
         // mock de repositório retornando um cliente, caso exista o email
         repository.findBy = jest.fn().mockImplementation(() => {
            return Promise.resolve([]);
         });

         await service.findByCpf('12345678901').catch((error) => {
            expect(error.message).toEqual(CpfValidoClienteValidator.CPF_VALIDO_CLIENTE_VALIDATOR_ERROR_MESSAGE);
         });
      });

      it('não deve consultar cliente por cpf quando houver um erro de banco ', async () => {
         const error = new RepositoryException('Erro genérico de banco de dados');
         jest.spyOn(repository, 'findBy').mockRejectedValue(error);

         // verifiaca se foi lançada uma exception na camada de serviço
         await expect(service.findByCpf(cliente.cpf)).rejects.toThrowError(ServiceException);
      });
   });
});
