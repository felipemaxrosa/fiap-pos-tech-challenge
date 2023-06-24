import { Test, TestingModule } from '@nestjs/testing';

import { Pedido } from 'src/domain/pedido/model/pedido.model';
import { IRepository } from 'src/domain/repository/repository';
import { IService } from 'src/domain/service/service';
import { PedidoService } from './pedido.service';
import { RepositoryException } from 'src/infrastructure/exception/repository.exception';
import { ServiceException } from 'src/domain/exception/service.exception';
import { ESTADO_PEDIDO } from '../enums/pedido';
import { PedidoConstants } from 'src/shared/constants';
import { CriarNovoPedidoRequest } from 'src/application/web/pedido/request/criar-novo-pedido.request';
import { CriarNovoPedidoValidator } from '../validation/criar-novo-pedido.validator';
import { EstadoCorretoNovoPedidoValidator } from '../validation/estado-correto-novo-pedido.validator';

describe('PedidoService', () => {
   let service: IService<Pedido>;
   let repository: IRepository<Pedido>;
   let validators: CriarNovoPedidoValidator[];

   const pedido: Pedido = {
      id: 1,
      clienteId: 1,
      dataInicio: '2023-06-18',
      estadoPedido: ESTADO_PEDIDO.RECEBIDO,
      ativo: true,
   };

   beforeEach(async () => {
      // Configuração do módulo de teste
      const module: TestingModule = await Test.createTestingModule({
         providers: [
            //  IService<Pedido> provider
            {
               provide: PedidoConstants.ISERVICE,
               inject: [PedidoConstants.IREPOSITORY, 'CriarNovoPedidoValidator'],
               useFactory: (
                  repository: IRepository<Pedido>,
                  criarNovoPedidoValidator: CriarNovoPedidoValidator[],
               ): IService<Pedido> => {
                  return new PedidoService(repository, criarNovoPedidoValidator);
               },
            },
            // Mock do serviço IRepository<Pedido>
            {
               provide: PedidoConstants.IREPOSITORY,
               useValue: {
                  // mock para a chamama repository.save(pedido)
                  save: jest.fn(() => Promise.resolve(pedido)),
                  // mock para a chamama repository.findBy(attributes)
                  findBy: jest.fn(() => {
                     // retorna vazio, sumulando que não encontrou registros pelo atributos passados por parâmetro
                     return Promise.resolve({});
                  }),
                  // mock para a chamada repository.edit(produto)
                  edit: jest.fn(() => Promise.resolve(pedido)),
                  // mock para a chamada repository.delete(id)
                  delete: jest.fn(() => Promise.resolve(true)),
               },
            },
            // Mock do CriarNovoPedidoValidator
            {
               provide: 'CriarNovoPedidoValidator',
               inject: [PedidoConstants.IREPOSITORY],
               useFactory: (): CriarNovoPedidoValidator[] => {
                  return [new EstadoCorretoNovoPedidoValidator()];
               },
            },
         ],
      }).compile();

      // Desabilita a saída de log
      module.useLogger(false);

      // Obtém a instância do repositório, validators e serviço a partir do módulo de teste
      repository = module.get<IRepository<Pedido>>(PedidoConstants.IREPOSITORY);
      validators = module.get<CriarNovoPedidoValidator[]>('CriarNovoPedidoValidator');
      service = module.get<IService<Pedido>>(PedidoConstants.ISERVICE);
   });

   describe('injeção de dependências', () => {
      it('deve existir instância de repositório definida', async () => {
         expect(repository).toBeDefined();
         expect(validators).toBeDefined();
      });
   });

   describe('save', () => {
      it('deve CRIAR novo pedido', async () => {
         const novoPedido: CriarNovoPedidoRequest = {
            clienteId: 1,
            dataInicio: '2023-06-18',
            estadoPedido: ESTADO_PEDIDO.RECEBIDO,
            ativo: true,
         };

         await service.save(novoPedido).then((pedidoSalvo) => {
            // verifica se o pedido criado contém os mesmos dados passados como input
            expect(pedidoSalvo.id).toEqual(1);
            expect(pedidoSalvo.clienteId).toEqual(novoPedido.clienteId);
            expect(pedidoSalvo.dataInicio).toEqual(novoPedido.dataInicio);
            expect(pedidoSalvo.estadoPedido).toEqual(novoPedido.estadoPedido);
         });
      });

      it('não deve criar um novo pedido quando houver um erro de banco ', async () => {
         const error = new RepositoryException('Erro genérico de banco de dados');
         jest.spyOn(repository, 'save').mockRejectedValue(error);

         // verifiaca se foi lançada uma exception na camada de serviço
         await expect(service.save(pedido)).rejects.toThrowError(ServiceException);
      });
   });

   describe('edit', () => {
      it('editar deve falhar porque não foi implementado', async () => {
         await service.edit(pedido).then((pedidoEditado) => {
            expect(pedidoEditado.clienteId).toEqual(pedido.clienteId);
            expect(pedidoEditado.dataInicio).toEqual(pedido.dataInicio);
            expect(pedidoEditado.estadoPedido).toEqual(pedido.estadoPedido);
            expect(pedidoEditado.id).toEqual(pedido.id);
         });
      });

      it('não deve editar produto quando houver um erro de banco ', async () => {
         const error = new RepositoryException('Erro genérico de banco de dados');
         jest.spyOn(repository, 'edit').mockRejectedValue(error);

         // verifica se foi lançada uma exception na camada de serviço
         await expect(service.edit(pedido)).rejects.toThrowError(ServiceException);
      }); // end it não deve editar produto quando houver um erro de banco
   });

   describe('delete', () => {
      it('deletar pedido', async () => {
         await service.delete(1).then((result) => expect(result).toBeTruthy());
      });

      it('não deve deletar produto quando houver um erro de banco ', async () => {
         const error = new RepositoryException('Erro genérico de banco de dados');
         jest.spyOn(repository, 'delete').mockRejectedValue(error);

         // verifica se foi lançada uma exception na camada de serviço
         await expect(service.delete(1)).rejects.toThrowError(ServiceException);
      }); // end it não deve deletar produto quando houver um erro de banco
   });
});
