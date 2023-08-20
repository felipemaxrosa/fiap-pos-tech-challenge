import {
   Body,
   Controller,
   Delete,
   Get,
   Inject,
   Logger,
   NotFoundException,
   Param,
   ParseIntPipe,
   Post,
   Put,
} from '@nestjs/common';
import { ApiCreatedResponse, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { IProdutoService } from 'src/application/produto/service/produto.service.interface';
import { BaseController } from 'src/presentation/web/base.controller';
import { EditarProdutoRequest } from 'src/presentation/web/produto/request/editar-produto.request';
import { SalvarProdutoRequest } from 'src/presentation/web/produto/request/salvar-produto.request';
import { BuscaPorIdProdutoResponse } from 'src/presentation/web/produto/response/busca-por-id-produto.response';
import { BuscaTodosPorIdCategoriaProdutoResponse } from 'src/presentation/web/produto/response/busca-todos-por-id-categoria-produto.response';
import { EditarProdutoResponse } from 'src/presentation/web/produto/response/editar-produto.response';
import { SalvarProdutoResponse } from 'src/presentation/web/produto/response/salvar-produto.response';
import { ProdutoConstants } from 'src/shared/constants';

@Controller('v1/produto')
@ApiTags('Produto')
export class ProdutoController extends BaseController {
   private logger: Logger = new Logger(ProdutoController.name);

   constructor(@Inject(ProdutoConstants.ISERVICE) private service: IProdutoService) {
      super();
   }

   @Post()
   @ApiOperation({
      summary: 'Adiciona um novo produto',
      description: 'Adiciona um novo produto',
   })
   @ApiCreatedResponse({ description: 'Produto salvo com sucesso', type: SalvarProdutoResponse })
   async save(@Body() request: SalvarProdutoRequest): Promise<SalvarProdutoResponse> {
      this.logger.debug(`Salvando Produto request: ${JSON.stringify(request)}`);
      return await this.service
         .save({
            nome: request.nome,
            idCategoriaProduto: request.idCategoriaProduto,
            descricao: request.descricao,
            preco: request.preco,
            imagemBase64: request.imagemBase64,
            ativo: request.ativo,
         })
         .then((produto) => {
            this.logger.log(`Produto salvo com sucesso: ${produto.id}}`);
            return new SalvarProdutoResponse(produto);
         });
   }

   @Put(':id')
   @ApiOperation({
      summary: 'Edita um produto',
      description: 'Realiza a edição de um produto',
   })
   @ApiOkResponse({ description: 'Produto editado com sucesso', type: EditarProdutoResponse })
   async edit(
      @Param('id', ParseIntPipe) id: number,
      @Body() request: EditarProdutoRequest,
   ): Promise<EditarProdutoResponse> {
      this.logger.debug(`Editando Produto request: ${JSON.stringify(request)}`);
      return await this.service
         .edit({
            id: id,
            nome: request.nome,
            idCategoriaProduto: request.idCategoriaProduto,
            descricao: request.descricao,
            preco: request.preco,
            imagemBase64: request.imagemBase64,
            ativo: request.ativo,
         })
         .then((produto) => {
            this.logger.log(`Produto editado com sucesso: ${produto.id}}`);
            return new EditarProdutoResponse(produto);
         });
   }

   @Delete(':id')
   @ApiOperation({
      summary: 'Deleta um produto',
      description: 'Realiza a deleção de um produto por ID',
   })
   @ApiOkResponse({ description: 'Produto deletado com sucesso', type: Boolean })
   async delete(@Param('id', ParseIntPipe) id: number): Promise<boolean> {
      this.logger.debug(`Deletando produto id: ${id}`);
      return await this.service.delete(id).then((result) => {
         this.logger.log(`Produto deletado com sucesso: ${id}}`);
         return result;
      });
   }

   @Get(':id')
   @ApiOperation({
      summary: 'Consulta produto por ID',
      description: 'Realiza a consulta de um produto por ID',
   })
   @ApiOkResponse({ description: 'Produto encontrado com sucesso', type: BuscaPorIdProdutoResponse })
   async findById(@Param('id', ParseIntPipe) id: number): Promise<BuscaPorIdProdutoResponse> {
      this.logger.debug(`Procurando Produto id: ${id}`);
      return await this.service.findById(id).then((produto) => {
         if (produto) {
            this.logger.log(`Produto encontrado com sucesso: ${produto.id}}`);
            return new BuscaPorIdProdutoResponse(produto);
         }
         this.logger.debug(`Produto não encontrado: ${id}`);
         throw new NotFoundException(`Produto não encontrado: ${id}}`);
      });
   }

   @Get('categoria/:id')
   @ApiOperation({
      summary: 'Consulta produtos por categoria',
      description: 'Realiza a consulta de produtos por ID da categoria',
   })
   @ApiOkResponse({
      description: 'Produtos encontrados com sucesso',
      type: BuscaTodosPorIdCategoriaProdutoResponse,
      isArray: true,
   })
   async findByIdCategoriaProduto(
      @Param('id', ParseIntPipe) id: number,
   ): Promise<BuscaTodosPorIdCategoriaProdutoResponse[]> {
      this.logger.debug(`Procurando Produtos para idCategoriaProduto: ${id}`);
      return await this.service.findByIdCategoriaProduto(id).then((produtos) => {
         if (produtos) {
            this.logger.debug(`Produtos encontrado com sucesso: ${JSON.stringify(produtos)}`);
            return produtos.map((produto) => new BuscaTodosPorIdCategoriaProdutoResponse(produto));
         }
         this.logger.debug(`Produtos não encontrados para idCategoriaProduto: ${id}`);
         throw new NotFoundException(`Produtos não encontrados para idCategoriaProduto: ${id}}`);
      });
   }
}
