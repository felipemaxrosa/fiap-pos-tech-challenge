import { Module } from '@nestjs/common';
import { APP_FILTER } from '@nestjs/core';

import { DomainModule } from '../domain/domain.module';
import { InfrastructureModule } from '../infrastructure/infrastructure.module';
import { PedidoController } from './web/pedido/controller/pedido.controller';
import { ClienteController } from './web/cliente/controller/cliente.controller';
import { ProdutoController } from './web/produto/controller/produto.controller';
import { GeneralExceptionHandler } from './web/handler/general-exception.handler';
import { PagamentoController } from './web/pagamento/controller/pagamento.controller';
import { ValidationExceptionHandler } from './web/handler/validation-exception.handler';
import { ItemPedidoController } from './web/item-pedido/controller/item-pedido.controller';
import { GeneralHttpExceptionHandler } from './web/handler/general-http-exception.handler';
import { InfraestructureExceptionHandler } from './web/handler/infraestructure-exception.handler';
import { CategoriaProdutoController } from './web/categoria/controller/categoria-produto.controller';

@Module({
   imports: [InfrastructureModule, DomainModule],
   providers: [
      { provide: APP_FILTER, useClass: GeneralExceptionHandler },
      { provide: APP_FILTER, useClass: GeneralHttpExceptionHandler },
      { provide: APP_FILTER, useClass: InfraestructureExceptionHandler },
      { provide: APP_FILTER, useClass: ValidationExceptionHandler },
   ],
   controllers: [
      ClienteController,
      PedidoController,
      ItemPedidoController,
      ProdutoController,
      CategoriaProdutoController,
      PagamentoController,
   ],
})
export class ApplicationModule {}
