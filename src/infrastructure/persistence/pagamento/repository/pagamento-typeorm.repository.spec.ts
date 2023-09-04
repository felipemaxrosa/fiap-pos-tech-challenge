import { Test, TestingModule } from '@nestjs/testing';
import { EstadoPagamento } from 'src/enterprise/pagamento/enums/pagamento.enums';
import { Pagamento } from 'src/enterprise/pagamento/model/pagamento.model';
import { IRepository } from 'src/enterprise/repository/repository';
import { RepositoryException } from 'src/infrastructure/exception/repository.exception';
import { PagamentoEntity } from 'src/infrastructure/persistence/pagamento/entity/pagamento.entity';
import { PagamentoConstants } from 'src/shared/constants';
import { Repository, TypeORMError } from 'typeorm';
import { PagamentoTypeormRepository } from './pagamento-typeorm.repository';

describe('PagamentoTypeormRepository', () => {
   let repository: IRepository<Pagamento>;
   let repositoryTypeOrm: Repository<PagamentoEntity>;

   const mockedPagamento: Pagamento = {
      dataHoraPagamento: new Date('2023-08-30'),
      estadoPagamento: EstadoPagamento.CONFIRMADO,
      pedidoId: 1,
      total: 10,
      transacaoId: '1',
      id: 1,
   };

   const mockedPagamentoEntity: PagamentoEntity = {
      dataHoraPagamento: new Date('2023-08-30'),
      estadoPagamento: EstadoPagamento.CONFIRMADO,
      pedidoId: 1,
      total: 10,
      transacaoId: '1',
      id: 1,
   };

   const mockedPagamentoEditado: Pagamento = {
      dataHoraPagamento: new Date('2023-08-31'),
      estadoPagamento: EstadoPagamento.REJEITADO,
      pedidoId: 2,
      total: 101,
      transacaoId: '2',
      id: 1,
   };

   const mockedPagamentoEditadoEntity: PagamentoEntity = {
      dataHoraPagamento: new Date('2023-08-31'),
      estadoPagamento: EstadoPagamento.REJEITADO,
      pedidoId: 2,
      total: 101,
      transacaoId: '2',
      id: 1,
   };

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
                  save: jest.fn(),
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
      it('deve salvar pagamento corretamente', async () => {
         jest.spyOn(repositoryTypeOrm, 'save').mockResolvedValue(mockedPagamentoEntity);

         await repository.save(mockedPagamento).then((pagamentoSalvo) => {
            // verifica se o pagamento salvo contém os mesmos dados passados como input
            expect(pagamentoSalvo.id).toEqual(mockedPagamento.id);
            expect(pagamentoSalvo.pedidoId).toEqual(mockedPagamento.pedidoId);
            expect(pagamentoSalvo.estadoPagamento).toEqual(mockedPagamento.estadoPagamento);
            expect(pagamentoSalvo.total).toEqual(mockedPagamento.total);
            expect(pagamentoSalvo.transacaoId).toEqual(mockedPagamento.transacaoId);
            expect(pagamentoSalvo.dataHoraPagamento.getTime()).toEqual(mockedPagamento.dataHoraPagamento.getTime());
         });
      }); // end it deve salvar pagamento corretamente

      it('não deve salvar pagamento quando houver um erro de banco ', async () => {
         const error = new TypeORMError('Erro genérico do TypeORM');
         jest.spyOn(repositoryTypeOrm, 'save').mockRejectedValue(error);

         // verifica se foi lançada uma exception na camada infra
         await expect(repository.save(mockedPagamento)).rejects.toThrowError(RepositoryException);
      }); // end it não deve salvar pagamento quando houver um erro de banco
   });

   describe('edit', () => {
      it('deve editar pagamento corretamente', async () => {
         const repositorySpy = jest.spyOn(repositoryTypeOrm, 'save').mockResolvedValue(mockedPagamentoEditadoEntity);

         await repository.edit(mockedPagamentoEditado).then((pagamentoEditado) => {
            // verifica se o pagamento editado contém os mesmos dados passados como input
            expect(pagamentoEditado.id).toEqual(mockedPagamentoEditado.id);
            expect(pagamentoEditado.pedidoId).toEqual(mockedPagamentoEditado.pedidoId);
            expect(pagamentoEditado.estadoPagamento).toEqual(mockedPagamentoEditado.estadoPagamento);
            expect(pagamentoEditado.total).toEqual(mockedPagamentoEditado.total);
            expect(pagamentoEditado.transacaoId).toEqual(mockedPagamentoEditado.transacaoId);
            expect(pagamentoEditado.dataHoraPagamento.getTime()).toEqual(
               mockedPagamentoEditado.dataHoraPagamento.getTime(),
            );
         });
         expect(repositorySpy).toBeCalled();
      }); // end it deve editar pagamento corretamente

      it('não deve editar pagamento quando houver um erro de banco ', async () => {
         const error = new TypeORMError('Erro genérico do TypeORM');
         jest.spyOn(repositoryTypeOrm, 'save').mockRejectedValue(error);

         // verifica se foi lançada uma exception na camada infra
         await expect(repository.edit(mockedPagamentoEditado)).rejects.toThrowError(RepositoryException);
      }); // end it não deve editar pagamento quando houver um erro de banco
   }); // end describe edit

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
