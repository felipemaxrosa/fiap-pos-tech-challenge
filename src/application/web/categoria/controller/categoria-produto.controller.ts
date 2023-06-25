import { Controller, Get, Inject, Logger } from '@nestjs/common';
import { ApiConsumes, ApiProduces, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ICategoriaProdutoService } from '../../../../domain/categoria/service/categoria-produto.service.interface';
import { CategoriaProduto } from '../../../../domain/categoria/model/categoria-produto.model';

@Controller('v1/categoria')
@ApiTags('CategoriaProduto')
@ApiConsumes('application/json')
@ApiProduces('application/json')
export class CategoriaProdutoController {
   private logger: Logger = new Logger(CategoriaProdutoController.name);

   constructor(@Inject('IService<CategoriaProduto>') private service: ICategoriaProdutoService) {}

   @Get()
   @ApiResponse({ status: 200, description: 'Categorias de produto encontradas com sucesso' })
   async findAll(): Promise<CategoriaProduto[]> {
      this.logger.debug(`Listando todas as categorias de produto`);
      return await this.service.findAll();
   }
}
