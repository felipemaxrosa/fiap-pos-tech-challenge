import { Test, TestingModule } from '@nestjs/testing';
import { ClienteProviders } from 'src/application/cliente/providers/cliente.providers';
import { BuscarClientePorCpfUseCase } from 'src/application/cliente/usecase/buscar-cliente-por-cpf.usecase';
import { IdentificarClienteUseCase } from 'src/application/cliente/usecase/identificar-cliente-por-cpf.usecase';
import { ClienteIdentificado } from 'src/enterprise/cliente/model/cliente-identificado.model';
import { Cliente } from 'src/enterprise/cliente/model/cliente.model';
import { PersistenceInMemoryProviders } from 'src/infrastructure/persistence/providers/persistence-in-memory.providers';
import { ClienteConstants } from 'src/shared/constants';

describe('IdentificarClienteUseCase', () => {
   let useCase: IdentificarClienteUseCase;
   let buscarUsecase: BuscarClientePorCpfUseCase;

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

      useCase = module.get<IdentificarClienteUseCase>(ClienteConstants.IDENTIFICAR_CLIENTE_POR_CPF_USECASE);
      buscarUsecase = module.get<BuscarClientePorCpfUseCase>(ClienteConstants.BUSCAR_CLIENTE_POR_CPF_USECASE);
   });

   describe('identificarClientePorCpf', () => {
      it('deve identificar um cliente existente por CPF com sucesso', async () => {
         jest.spyOn(buscarUsecase, 'buscarClientePorCpf').mockResolvedValue(clienteMock);

         const result = await useCase.identificarClientePorCpf(clienteMock.cpf);

         expect(result).toEqual(new ClienteIdentificado(clienteMock));
      });

      it('deve identificar um cliente anônimo quando o CPF é undefined', async () => {
         const cpf = undefined;

         const result = await useCase.identificarClientePorCpf(cpf);

         expect(result).toEqual(new ClienteIdentificado());
      });
   });
});
