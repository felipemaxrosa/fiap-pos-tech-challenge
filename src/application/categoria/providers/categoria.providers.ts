import { Provider } from '@nestjs/common';

import { CategoriaProdutoService } from 'src/application/categoria/service/categoria-produto.service';
import { IRepository } from 'src/enterprise/repository/repository';
import { CategoriaProdutoConstants } from 'src/shared/constants';
import { BuscarTodasCategoriasUseCase } from 'src/application/categoria/usecase/buscar-todas-categorias.usecase';
import { CategoriaProduto } from 'src/enterprise/categoria/model/categoria-produto.model';

export const CategoriaProdutosProviders: Provider[] = [
   { provide: CategoriaProdutoConstants.ISERVICE, useClass: CategoriaProdutoService },
   {
      provide: CategoriaProdutoConstants.BUSCAR_TODAS_CATEGORIAS_USECASE,
      inject: [CategoriaProdutoConstants.IREPOSITORY],
      useFactory: (repository: IRepository<CategoriaProduto>): BuscarTodasCategoriasUseCase =>
         new BuscarTodasCategoriasUseCase(repository),
   },
];
