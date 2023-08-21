import { Module } from '@nestjs/common';
import { APP_FILTER } from '@nestjs/core';
import { EnterpriseModule } from 'src/enterprise/enterprise.module';
import { InfrastructureModule } from 'src/infrastructure/infrastructure.module';
import { CategoriaProdutoController } from 'src/presentation/api/categoria/controller/categoria-produto.controller';
import { ClienteController } from 'src/presentation/api/cliente/controller/cliente.controller';
import { GeneralExceptionHandler } from 'src/presentation/api/handler/general-exception.handler';
import { GeneralHttpExceptionHandler } from 'src/presentation/api/handler/general-http-exception.handler';
import { InfraestructureExceptionHandler } from 'src/presentation/api/handler/infraestructure-exception.handler';
import { ValidationExceptionHandler } from 'src/presentation/api/handler/validation-exception.handler';
import { ItemPedidoController } from 'src/presentation/api/item-pedido/controller/item-pedido.controller';
import { PagamentoController } from 'src/presentation/api/pagamento/controller/pagamento.controller';
import { PedidoController } from 'src/presentation/api/pedido/controller/pedido.controller';
import { ProdutoController } from 'src/presentation/api/produto/controller/produto.controller';

@Module({
   imports: [InfrastructureModule, EnterpriseModule],
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
export class PresentationModule {}
