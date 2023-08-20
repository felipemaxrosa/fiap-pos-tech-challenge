import { Controller, Get, Inject, Logger } from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { ICategoriaProdutoService } from 'src/application/categoria/service/categoria-produto.service.interface';
import { BaseController } from 'src/presentation/web/base.controller';
import { ListarCategoriaResponse } from 'src/presentation/web/categoria/controller/response/listar-categoria.response';
import { CategoriaProdutoConstants } from 'src/shared/constants';

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
      description: 'Realiza buscas das categorias de produto',
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
