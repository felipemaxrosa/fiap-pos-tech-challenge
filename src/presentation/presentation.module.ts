import { Module } from '@nestjs/common';
import { APP_FILTER } from '@nestjs/core';
import { ApplicationModule } from 'src/application/application.module';
import { CategoriaProdutoRestApi } from 'src/presentation/rest/categoria/api/categoria-produto.api';
import { ClienteRestApi } from 'src/presentation/rest/cliente/api/cliente.api';
import { GeneralExceptionHandler } from 'src/presentation/rest/handler/general-exception.handler';
import { GeneralHttpExceptionHandler } from 'src/presentation/rest/handler/general-http-exception.handler';
import { InfraestructureExceptionHandler } from 'src/presentation/rest/handler/infraestructure-exception.handler';
import { ValidationExceptionHandler } from 'src/presentation/rest/handler/validation-exception.handler';
import { ItemPedidoRestApi } from 'src/presentation/rest/item-pedido/api/item-pedido.api';
import { PagamentoRestApi } from 'src/presentation/rest/pagamento/api/pagamento.api';
import { PedidoRestApi } from 'src/presentation/rest/pedido/api/pedido.api';
import { ProdutoRestApi } from 'src/presentation/rest/produto/api/produto.api';

@Module({
   imports: [ApplicationModule],
   providers: [
      { provide: APP_FILTER, useClass: GeneralExceptionHandler },
      { provide: APP_FILTER, useClass: GeneralHttpExceptionHandler },
      { provide: APP_FILTER, useClass: InfraestructureExceptionHandler },
      { provide: APP_FILTER, useClass: ValidationExceptionHandler },
   ],
   controllers: [
      ClienteRestApi,
      PedidoRestApi,
      ItemPedidoRestApi,
      ProdutoRestApi,
      CategoriaProdutoRestApi,
      PagamentoRestApi,
   ],
})
export class PresentationModule {}
