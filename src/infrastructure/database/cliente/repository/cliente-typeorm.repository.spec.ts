import { Test, TestingModule } from '@nestjs/testing';
import { Cliente } from 'src/domain/cliente/model/cliente.model';
import { IRepository } from 'src/domain/repository/repository';
import { ClienteEntity } from '../entity/cliente.entity';
import { Repository, TypeORMError } from 'typeorm';
import { ClienteTypeormRepository } from './cliente-typeorm.repository';
import { RepositoryException } from 'src/infrastructure/exception/repository.exception';

describe('ClienteTypeormRepository', () => {
   let repository: IRepository<Cliente>;
   let repositoryTypeOrm: Repository<ClienteEntity>;

   const cliente: Cliente = {
      id: 1,
      nome: 'Teste',
      email: 'teste@teste.com',
      cpf: '25634428777',
   };

   const clienteEntity: ClienteEntity = {
      id: 1,
      nome: 'Teste',
      email: 'teste@teste.com',
      cpf: '25634428777',
   };

   beforeEach(async () => {
      // Configuração do módulo de teste
      const module: TestingModule = await Test.createTestingModule({
         providers: [
            //  IRepository<Cliente> provider
            {
               provide: 'IRepository<Cliente>',
               inject: ['Repository<ClienteEntity>'],
               useFactory: (repositoryTypeOrm: Repository<ClienteEntity>): IRepository<Cliente> => {
                  return new ClienteTypeormRepository(repositoryTypeOrm);
               },
            },
            // Mock do serviço Repository<ClienteEntity>
            {
               provide: 'Repository<ClienteEntity>',
               useValue: {
                  // mock para a chamama repositoryTypeOrm.save(cliente)
                  save: jest.fn(() => Promise.resolve(clienteEntity)),
                  // mock para a chamama repositoryTypeOrm.findBy(attributes)
                  findBy: jest.fn(() => {
                     return Promise.resolve([clienteEntity]);
                  }),
               },
            },
         ],
      }).compile();

      // Desabilita a saída de log
      module.useLogger(false);

      // Obtém a instância dos repositórios
      repository = module.get<IRepository<Cliente>>('IRepository<Cliente>');
      repositoryTypeOrm = module.get<Repository<ClienteEntity>>('Repository<ClienteEntity>');
   });

   describe('injeção de dependências', () => {
      it('deve existir instâncias de repositório type orm definida', async () => {
         expect(repositoryTypeOrm).toBeDefined();
      });
   });

   describe('save', () => {
      it('deve salvar cliente', async () => {
         const repositorySpy = jest.spyOn(repositoryTypeOrm, 'save');

         await repository.save(cliente).then((clienteSalvo) => {
            // verifica se o cliente salvo contém os mesmos dados passados como input
            expect(clienteSalvo.id).toEqual(1);
            expect(clienteSalvo.nome).toEqual(cliente.nome);
            expect(clienteSalvo.email).toEqual(cliente.email);
            expect(clienteSalvo.cpf).toEqual(cliente.cpf);
         });

         expect(repositorySpy).toBeCalled();
      });

      it('não deve salvar cliente quando houver um erro de banco ', async () => {
         const error = new TypeORMError('Erro genérico do TypeORM');
         jest.spyOn(repositoryTypeOrm, 'save').mockRejectedValue(error);

         // verifiaca se foi lançada uma exception na camada infra
         await expect(repository.save(cliente)).rejects.toThrowError(RepositoryException);
      });
   });

   describe('findBy', () => {
      it('deve buscar cliente pelo cpf', async () => {
         repositoryTypeOrm.findBy = jest.fn().mockImplementation((attributes) => {
            return Promise.resolve(attributes['cpf'] === cliente.cpf ? [clienteEntity] : {});
         });

         await repository.findBy({ cpf: cliente.cpf }).then((clientesEncontrados) => {
            // verifica se o cliente salvo contém os mesmos dados passados como input
            clientesEncontrados.forEach((cliente) => {
               expect(cliente.cpf).toEqual(cliente.cpf);
               expect(cliente.id).not.toBeUndefined();
               expect(cliente.nome).not.toBeUndefined();
               expect(cliente.email).not.toBeUndefined();
            });
         });
      });

      it('deve buscar cliente pelo email', async () => {
         repositoryTypeOrm.findBy = jest.fn().mockImplementation((attributes) => {
            return Promise.resolve(attributes['email'] === cliente.email ? [clienteEntity] : {});
         });

         await repository.findBy({ email: cliente.email }).then((clientesEncontrados) => {
            // verifica se o cliente salvo contém os mesmos dados passados como input
            clientesEncontrados.forEach((cliente) => {
               expect(cliente.email).toEqual(cliente.email);
               expect(cliente.id).not.toBeUndefined();
               expect(cliente.nome).not.toBeUndefined();
               expect(cliente.cpf).not.toBeUndefined();
            });
         });
      });

      it('deve buscar cliente pelo nome', async () => {
         repositoryTypeOrm.findBy = jest.fn().mockImplementation((attributes) => {
            return Promise.resolve(attributes['nome'] === cliente.nome ? [clienteEntity] : {});
         });

         await repository.findBy({ nome: cliente.nome }).then((clientesEncontrados) => {
            // verifica se o cliente salvo contém os mesmos dados passados como input
            clientesEncontrados.forEach((cliente) => {
               expect(cliente.nome).toEqual(cliente.nome);
               expect(cliente.id).not.toBeUndefined();
               expect(cliente.nome).not.toBeUndefined();
               expect(cliente.email).not.toBeUndefined();
            });
         });
      });

      it('deve buscar cliente pelo id', async () => {
         repositoryTypeOrm.findBy = jest.fn().mockImplementation((attributes) => {
            return Promise.resolve(attributes['id'] === cliente.id ? [clienteEntity] : {});
         });

         await repository.findBy({ id: cliente.id }).then((clientesEncontrados) => {
            // verifica se o cliente salvo contém os mesmos dados passados como input
            clientesEncontrados.forEach((cliente) => {
               expect(cliente.id).toEqual(cliente.id);
               expect(cliente.cpf).not.toBeUndefined();
               expect(cliente.nome).not.toBeUndefined();
               expect(cliente.email).not.toBeUndefined();
            });
         });
      });

      it('não deve salvar cliente quando houver um erro de banco ', async () => {
         const error = new TypeORMError('Erro genérico do TypeORM');
         jest.spyOn(repositoryTypeOrm, 'findBy').mockRejectedValue(error);

         // verifiaca se foi lançada uma exception na camada infra
         await expect(repository.findBy({})).rejects.toThrowError(RepositoryException);
      });
   });

   describe('edit', () => {
      it('editar deve falhar porque não foi implementado', async () => {
         try {
            await expect(repository.edit(cliente));
         } catch (error) {
            expect(error.message).toEqual('Método não implementado.');
         }
      });
   });

   describe('delete', () => {
      it('deletar deve falhar porque não foi implementado', async () => {
         try {
            await expect(repository.delete(1));
         } catch (error) {
            expect(error.message).toEqual('Método não implementado.');
         }
      });
   });
});
