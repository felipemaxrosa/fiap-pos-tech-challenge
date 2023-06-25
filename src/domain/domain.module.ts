import { Module } from '@nestjs/common';
import { Cliente } from './cliente/model/cliente.model';
import { ClienteService } from './cliente/service/cliente.service';
import { IRepository } from './repository/repository';
import { CpfUnicoClienteValidator } from './cliente/validation/cpf-unico-cliente.validator';
import { EmailUnicoClienteValidator } from './cliente/validation/email-unico-cliente.validator';
import { SalvarClienteValidator } from './cliente/validation/salvar-cliente.validator';
import { PedidoService } from './pedido/service/pedido.service';
import { CriarNovoPedidoValidator } from './pedido/validation/criar-novo-pedido.validator';
import { EstadoCorretoNovoPedidoValidator } from './pedido/validation/estado-correto-novo-pedido.validator';
import { PedidoConstants } from 'src/shared/constants';
import { ProdutoService } from './produto/service/produto.service';
import { Produto } from './produto/model/produto.model';
import { SalvarProdutoValidator } from './produto/validation/salvar-produto.validator';
import { CamposObrigatoriosProdutoValidator } from './produto/validation/campos-obrigatorios-produto.validator';
import { BuscarClienteValidator } from './cliente/validation/buscar-cliente.validator';
import { CpfValidoClienteValidator } from './cliente/validation/cpf-valido-cliente.validator';
import { EmailValidoClienteValidator } from './cliente/validation/email-valido-cliente.validator.';
import { CategoriaProdutoService } from './categoria/service/categoria-produto.service';

@Module({
   providers: [
      // Cliente
      { provide: 'IService<Cliente>', useClass: ClienteService },
      {
         provide: 'SalvarClienteValidator',
         inject: ['IRepository<Cliente>'],
         useFactory: (repository: IRepository<Cliente>): SalvarClienteValidator[] => [
            new CpfValidoClienteValidator(),
            new EmailValidoClienteValidator(),
            new EmailUnicoClienteValidator(repository),
            new CpfUnicoClienteValidator(repository),
         ],
      },

      // Pedido
      { provide: PedidoConstants.ISERVICE, useClass: PedidoService },
      {
         provide: 'CriarNovoPedidoValidator',
         inject: [PedidoConstants.IREPOSITORY],
         useFactory: (): CriarNovoPedidoValidator[] => [new EstadoCorretoNovoPedidoValidator()],
      },

      // Produto
      { provide: 'IService<Produto>', useClass: ProdutoService },
      {
         provide: 'SalvarProdutoValidator',
         inject: ['IRepository<Produto>'],
         useFactory: (repository: IRepository<Produto>): SalvarProdutoValidator[] => [
            new CamposObrigatoriosProdutoValidator(repository),
         ],
      },
      {
         provide: 'BuscarClienteValidator',
         useFactory: (): BuscarClienteValidator[] => [new CpfValidoClienteValidator()],
      },

      // Categoria de Produto
      { provide: 'IService<CategoriaProduto>', useClass: CategoriaProdutoService },
   ],
   exports: [
      { provide: 'IService<Cliente>', useClass: ClienteService },
      { provide: PedidoConstants.ISERVICE, useClass: PedidoService },
      { provide: 'IService<Produto>', useClass: ProdutoService },
      { provide: 'IService<CategoriaProduto>', useClass: CategoriaProdutoService },
   ],
})
export class DomainModule {}
