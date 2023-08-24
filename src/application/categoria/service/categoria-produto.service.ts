import { Inject, Injectable, Logger } from '@nestjs/common';
import { ICategoriaProdutoService } from 'src/application/categoria/service/categoria-produto.service.interface';
import { BuscarTodasCategoriasUseCase } from 'src/application/categoria/usecase/buscar-todas-categorias.usecase';
import { CategoriaProduto } from 'src/enterprise/categoria/model/categoria-produto.model';
import { CategoriaProdutoConstants } from 'src/shared/constants';

@Injectable()
export class CategoriaProdutoService implements ICategoriaProdutoService {

   constructor(@Inject(CategoriaProdutoConstants.BUSCAR_TODAS_CATEGORIAS_USECASE) private useCase: BuscarTodasCategoriasUseCase) {}

   async findAll(): Promise<CategoriaProduto[]> {
      return this.useCase.buscarTodasCategorias()
   }
}
