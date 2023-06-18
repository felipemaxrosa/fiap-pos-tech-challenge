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

describe('PedidoService', () => {
   let service: IService<Pedido>;
   let repository: IRepository<Pedido>;

   const pedido: Pedido = {
      id: 1,
      clienteId: 1,
      dataInicio: '2023-06-18',
      estadoPedido: ESTADO_PEDIDO.EM_PREPARO,
   };

   beforeEach(async () => {
      // Configuração do módulo de teste
      const module: TestingModule = await Test.createTestingModule({
         providers: [
            //  IService<Pedido> provider
            {
               provide: PedidoConstants.ISERVICE,
               inject: [PedidoConstants.IREPOSITORY],
               useFactory: (repository: IRepository<Pedido>): IService<Pedido> => {
                  return new PedidoService(repository);
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
               },
            },
         ],
      }).compile();

      // Desabilita a saída de log
      module.useLogger(false);

      // Obtém a instância do repositório, validators e serviço a partir do módulo de teste
      repository = module.get<IRepository<Pedido>>(PedidoConstants.IREPOSITORY);
      service = module.get<IService<Pedido>>(PedidoConstants.ISERVICE);
   });

   describe('injeção de dependências', () => {
      it('deve existir instância de repositório definida', async () => {
         expect(repository).toBeDefined();
      });
   });

   describe('save', () => {
      it('deve CRIAR novo pedido', async () => {
         const novoPedido: CriarNovoPedidoRequest = {
            clienteId: 1,
            dataInicio: '2023-06-18',
            estadoPedido: ESTADO_PEDIDO.EM_PREPARO,
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
});
