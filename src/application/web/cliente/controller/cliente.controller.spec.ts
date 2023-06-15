import { Test, TestingModule } from '@nestjs/testing';
import { ClienteController } from './cliente.controller';
import { Cliente } from 'src/domain/cliente/model/cliente.model';
import { IService } from 'src/domain/service/service';
import { SalvarClienteRequest } from '../request/salvar-cliente.request';

describe('ClienteController', () => {
  let controller: ClienteController;
  let service: IService<Cliente>;

  // Define um objeto de requisição
  const request: SalvarClienteRequest = {
    nome: 'Teste',
    email: 'teste@teste.com',
    cpf: '123456789',
  };

  // Define um objeto de cliente esperado como resultado
  const cliente: Cliente = {
    id: 1,
    nome: 'Teste',
    email: 'teste@teste.com',
    cpf: '123456789',
  };

  beforeEach(async () => {
    // Configuração do módulo de teste
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ClienteController],
      providers: [
        // Mock do serviço IService<Cliente>
        {
          provide: 'IService<Cliente>',
          useValue: {
            // Mocka chamada para o save, rejeitando a promise em caso de request undefined
            save: jest.fn((request) => request ? Promise.resolve(cliente) : Promise.reject(new Error('error'))),
          },
        },
      ],
    }).compile();

    // Obtém a instância do controller e do serviço a partir do módulo de teste
    controller = module.get<ClienteController>(ClienteController);
    service = module.get<IService<Cliente>>('IService<Cliente>');
  });

  describe('salvar', () => {
    it('deve existir instância de serviço definida', async () => {  
        // Verifica se a instância de serviço está definida
        expect(service).toBeDefined()
      });

    it('deve salvar um novo cliente', async () => {
      // Chama o método salvar do controller
      const result = await controller.salvar(request);

      // Verifica se o método save do serviço foi chamado corretamente com a requisição
      expect(service.save).toHaveBeenCalledWith(request);

      // Verifica se o resultado obtido é igual ao objeto cliente esperado
      expect(result).toEqual(cliente);
    });

    it('não deve tratar erro a nível de controlador', async () => {
        
        const error = new Error('Erro genérico não tratado');
        jest.spyOn(service, 'save').mockRejectedValue(error);
  
        // Chama o método salvar do controller
        await expect(controller.salvar(request)).rejects.toThrow('Erro genérico não tratado');
  
        // Verifica se método save foi chamado com o parametro esperado
        expect(service.save).toHaveBeenCalledWith(request);
      });

  });
});
