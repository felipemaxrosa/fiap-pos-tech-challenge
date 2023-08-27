import { Repository, TypeORMError } from 'typeorm';
import { Test, TestingModule } from '@nestjs/testing';
import { EstadoPagamento } from 'src/enterprise/pagamento/enums/pagamento.enums';
import { Pagamento } from 'src/enterprise/pagamento/model/pagamento.model';
import { RepositoryException } from 'src/infrastructure/exception/repository.exception';
import { PagamentoEntity } from 'src/infrastructure/persistence/pagamento/entity/pagamento.entity';
import { IRepository } from 'src/enterprise/repository/repository';
import { PagamentoConstants } from 'src/shared/constants';
import { PagamentoTypeormRepository } from './pagamento-typeorm.repository';

describe('PagamentoTypeormRepository', () => {
   let repository: IRepository<Pagamento>;
   let repositoryTypeOrm: Repository<PagamentoEntity>;

   const mockedPagamento: Pagamento = {
      dataHoraPagamento: new Date(),
      estadoPagamento: EstadoPagamento.CONFIRMADO,
      pedidoId: 1,
      total: 10,
      transacaoId: 1,
      id: 1,
   };

   const mockedPagamentoEntity: PagamentoEntity = {
      dataHoraPagamento: new Date(),
      estadoPagamento: EstadoPagamento.CONFIRMADO,
      pedidoId: 1,
      total: 10,
      transacaoId: 1,
      id: 1,
   };

   const pagamentos: Pagamento[] = [
      mockedPagamento,
      {
         dataHoraPagamento: new Date(),
         estadoPagamento: EstadoPagamento.PENDENTE,
         pedidoId: 2,
         total: 20,
         transacaoId: 2,
         id: 2,
      },
   ];

   beforeEach(async () => {
      // Configuração do módulo de teste
      const module: TestingModule = await Test.createTestingModule({
         providers: [
            //  IRepository<Pagamento> provider
            {
               provide: PagamentoConstants.IREPOSITORY,
               inject: [PagamentoConstants.REPOSITORY_PAGAMENTO_ENTITY],
               useFactory: (repositoryTypeOrm: Repository<PagamentoEntity>): IRepository<Pagamento> => {
                  return new PagamentoTypeormRepository(repositoryTypeOrm);
               },
            },
            // Mock do serviço Repository<PagamentoEntity>
            {
               provide: PagamentoConstants.REPOSITORY_PAGAMENTO_ENTITY,
               useValue: {
                  findBy: jest.fn(),
               },
            },
         ],
      }).compile();

      // Desabilita a saída de log
      module.useLogger(false);

      // Obtém a instância dos repositórios
      repository = module.get<IRepository<Pagamento>>(PagamentoConstants.IREPOSITORY);
      repositoryTypeOrm = module.get<Repository<PagamentoEntity>>(PagamentoConstants.REPOSITORY_PAGAMENTO_ENTITY);
   });

   describe('injeção de dependências', () => {
      it('deve existir instâncias de repositório type orm definida', async () => {
         expect(repositoryTypeOrm).toBeDefined();
      });
   });

   describe('findBy', () => {
      it('deve buscar pagamento por ID do pedido', async () => {
         repositoryTypeOrm.findBy = jest.fn().mockImplementation((attributes: Partial<Pagamento>) => {
            return Promise.resolve(attributes['pedidoId'] === mockedPagamento.pedidoId ? [mockedPagamentoEntity] : {});
         });

         await repository.findBy({ pedidoId: 1 }).then((pagamentosEncontrados) => {
            pagamentosEncontrados.forEach((pagamento) => {
               expect(pagamento.id).toEqual(mockedPagamento.id);
            });
         });
      });

      it('não deve buscar novo pedido quando houver um erro de banco ', async () => {
         const error = new TypeORMError('Erro genérico do TypeORM');
         jest.spyOn(repositoryTypeOrm, 'findBy').mockRejectedValue(error);

         // verifica se foi lançada uma exception na camada infra
         await expect(repository.findBy({})).rejects.toThrowError(RepositoryException);
      });
   });

   describe('save', () => {
      it('salvar deve falhar porque não foi implementado', async () => {
         await expect(repository.save(mockedPagamento)).rejects.toThrow(
            new RepositoryException('Método não implementado.'),
         );
      });
   });

   describe('edit', () => {
      it('editar deve falhar porque não foi implementado', async () => {
         await expect(repository.edit(mockedPagamento)).rejects.toThrow(
            new RepositoryException('Método não implementado.'),
         );
      });
   });

   describe('delete', () => {
      it('deletar deve falhar porque não foi implementado', async () => {
         await expect(repository.delete(1)).rejects.toThrow(new RepositoryException('Método não implementado.'));
      });
   });

   describe('findAll', () => {
      it('deletar deve falhar porque não foi implementado', async () => {
         await expect(repository.findAll()).rejects.toThrow(new RepositoryException('Método não implementado.'));
      });
   });
});
