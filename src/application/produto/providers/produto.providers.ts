import { Provider } from '@nestjs/common';
import { ProdutoService } from 'src/application/produto/service/produto.service';
import { BuscarProdutoPorIdCategoriaUseCase } from 'src/application/produto/usecase/buscar-produto-por-id-categoria.usecase';
import { BuscarProdutoPorIdUseCase } from 'src/application/produto/usecase/buscar-produto-por-id.usecase';
import { DeletarProdutoUseCase } from 'src/application/produto/usecase/deletar-produto.usecase';
import { EditarProdutoUseCase } from 'src/application/produto/usecase/editar-produto.usecase';
import { SalvarProdutoUseCase } from 'src/application/produto/usecase/salvar-produto.usecase';
import { CamposObrigatoriosProdutoValidator } from 'src/application/produto/validation/campos-obrigatorios-produto.validator';
import { NomeUnicoProdutoValidator } from 'src/application/produto/validation/nome-unico-produto.validator';
import { SalvarProdutoValidator } from 'src/application/produto/validation/salvar-produto.validator';

import { Produto } from 'src/enterprise/produto/model/produto.model';
import { IRepository } from 'src/enterprise/repository/repository';
import { ProdutoConstants } from 'src/shared/constants';

export const ProdutoProviders: Provider[] = [
   { provide: ProdutoConstants.ISERVICE, useClass: ProdutoService },
   {
      provide: ProdutoConstants.SALVAR_PRODUTO_USECASE,
      inject: [ProdutoConstants.IREPOSITORY, ProdutoConstants.SALVAR_PRODUTO_VALIDATOR],
      useFactory: (repository: IRepository<Produto>, validators: SalvarProdutoValidator[]): SalvarProdutoUseCase =>
         new SalvarProdutoUseCase(repository, validators),
   },
   {
      provide: ProdutoConstants.EDITAR_PRODUTO_USECASE,
      inject: [ProdutoConstants.IREPOSITORY, ProdutoConstants.SALVAR_PRODUTO_VALIDATOR],
      useFactory: (repository: IRepository<Produto>, validators: SalvarProdutoValidator[]): EditarProdutoUseCase =>
         new EditarProdutoUseCase(repository, validators),
   },
   {
      provide: ProdutoConstants.DELETAR_PRODUTO_USECASE,
      inject: [ProdutoConstants.IREPOSITORY],
      useFactory: (repository: IRepository<Produto>): DeletarProdutoUseCase => new DeletarProdutoUseCase(repository),
   },
   {
      provide: ProdutoConstants.BUSCAR_PRODUTO_POR_ID_USECASE,
      inject: [ProdutoConstants.IREPOSITORY],
      useFactory: (repository: IRepository<Produto>): BuscarProdutoPorIdUseCase =>
         new BuscarProdutoPorIdUseCase(repository),
   },
   {
      provide: ProdutoConstants.BUSCAR_PRODUTO_POR_ID_CATEGORIA_USECASE,
      inject: [ProdutoConstants.IREPOSITORY],
      useFactory: (repository: IRepository<Produto>): BuscarProdutoPorIdCategoriaUseCase =>
         new BuscarProdutoPorIdCategoriaUseCase(repository),
   },
   {
      provide: ProdutoConstants.SALVAR_PRODUTO_VALIDATOR,
      inject: [ProdutoConstants.IREPOSITORY],
      useFactory: (repository: IRepository<Produto>): SalvarProdutoValidator[] => [
         new CamposObrigatoriosProdutoValidator(repository),
         new NomeUnicoProdutoValidator(repository),
      ],
   },
];
