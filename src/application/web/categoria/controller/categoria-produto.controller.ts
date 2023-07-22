import { Controller, Get, Inject, Logger } from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';

import { ICategoriaProdutoService } from '../../../../domain/categoria/service/categoria-produto.service.interface';
import { CategoriaProdutoConstants } from '../../../../shared/constants';
import { BaseController } from '../../base.controller';
import { ListarCategoriaResponse } from './response/listar-categoria.response';

@Controller('v1/categoria')
@ApiTags('Categoria')
export class CategoriaProdutoController extends BaseController {
   private logger: Logger = new Logger(CategoriaProdutoController.name);

   constructor(@Inject(CategoriaProdutoConstants.ISERVICE) private service: ICategoriaProdutoService) {
      super();
   }

   @Get()
   @ApiOperation({
      summary: 'Lista categorias de produto',
      description: 'Reliza buscas das categorias de produto',
   })
   @ApiOkResponse({
      description: 'Categorias de produto encontradas com sucesso',
      type: ListarCategoriaResponse,
      isArray: true,
   })
   async findAll(): Promise<ListarCategoriaResponse[]> {
      this.logger.debug(`Listando todas as categorias de produto`);
      return await this.service.findAll().then((categorias) => {
         return categorias.map((categoria) => new ListarCategoriaResponse(categoria));
      });
   }
}
