import { Test, TestingModule } from '@nestjs/testing';
import { Cliente } from 'src/domain/cliente/model/cliente.model';
import { SalvarClienteValidator } from '../validation/salvar-cliente.validator';
import { IRepository } from 'src/domain/repository/repository';
import { IService } from 'src/domain/service/service';
import { ClienteService } from './cliente.service';
import { EmailUnicoClienteValidator } from '../validation/email-unico-cliente.validator';
import { CpfUnicoClienteValidator } from '../validation/cpf-unico-cliente.validator';
describe('CienteService', () => {
  let service: IService<Cliente>;
  let repository: IRepository<Cliente>;
  let validators: SalvarClienteValidator[]

  const cliente: Cliente = {
    id:1,
    nome: 'Teste',
    email: 'teste@teste.com',
    cpf: '123456789',
  };
  
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        //  IService<Cliente> provider
         {
          provide: 'IService<Cliente>',
          inject: ['IRepository<Cliente>', 'SalvarClienteValidator'],
          useFactory: (repository: IRepository<Cliente>, salvarClienteValidator: SalvarClienteValidator[]): IService<Cliente> =>{
              return new ClienteService(repository, salvarClienteValidator)
          }
        },
        // Mock do serviço IRepository<Cliente>
        {
          provide: 'IRepository<Cliente>',
          useValue: {
            // mock para a chamama repository.save(cliente)
            save: jest.fn(() => Promise.resolve(cliente)),
            findBy: jest.fn((attributes) => {
                // retorna vazio, sumulando que não encontrou registros pelo atributos passados por parâmetro
                return Promise.resolve({})
            }),
          },
        },
         // Mock do SalvarClienteValidator
        {
            provide: 'SalvarClienteValidator',
            inject: ['IRepository<Cliente>'],
            useFactory: (repository: IRepository<Cliente>): SalvarClienteValidator[] => {
              return [
                new EmailUnicoClienteValidator(repository),
                new CpfUnicoClienteValidator(repository),
              ]
            }
        }
      ],
    }).compile();

    // Obtém a instância do serviço e repositório a partir do módulo de teste
    repository = module.get<IRepository<Cliente>>('IRepository<Cliente>')
    validators = module.get<SalvarClienteValidator[]>('SalvarClienteValidator')
    service =  module.get<IService<Cliente>>('IService<Cliente>')
  });

  describe('save', () => {
    it('deve existir classe de repositório e validator definidas', async () => {  
        expect(repository).toBeDefined()
        expect(validators).toBeDefined()
    });

    it('deve salvar cliente', async () => {

      let cliente: Cliente = {
        nome: 'Teste',
        email: 'teste@teste.com',
        cpf: '123456789',
      }

      await service.save(cliente)
          .then((clienteSalvo) => {
              expect(clienteSalvo.id).toEqual(1)
              expect(clienteSalvo.nome).toEqual(cliente.nome)
              expect(clienteSalvo.email).toEqual(cliente.email)
              expect(clienteSalvo.cpf).toEqual(cliente.cpf)
          })
    });

    it('não deve salvar cliente quando existir um cliente com email existente', async () => {

      let cliente: Cliente = {
        nome: 'Teste',
        email: 'teste@teste.com',
        cpf: '123456789',
      }

      // mock de repositório retornando um cliente, caso exista o email
      repository.findBy = jest.fn().mockImplementation((attributes) => {
        return Promise.resolve(attributes['email'] === cliente.email ? [cliente]: {})
    })

      await expect(service.save(cliente)).rejects.toThrowError(EmailUnicoClienteValidator.EMAIL_UNICO_CLIENTE_VALIDATOR_ERROR_MESSAGE)
    });

    it('não deve salvar cliente quando existir um cliente com cpf existente', async () => {

      let cliente: Cliente = {
        nome: 'Teste',
        email: 'teste@teste.com',
        cpf: '123456789',
      }

      // mock de repositório retornando um cliente, caso exista o cpf
      repository.findBy = jest.fn().mockImplementation((attributes) => {
          return Promise.resolve(attributes['cpf'] === cliente.cpf ? [cliente]: {})
      })

      await expect(service.save(cliente)).rejects.toThrowError(CpfUnicoClienteValidator.CPF_UNICO_CLIENTE_VALIDATOR_ERROR_MESSAGE)
    });

  });
});
