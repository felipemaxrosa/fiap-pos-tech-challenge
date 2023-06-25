import { Body, Controller, Delete, Get, Inject, Logger, NotFoundException, Param, Post, Put } from '@nestjs/common';
import { ApiConsumes, ApiCreatedResponse, ApiProduces, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Produto } from '../../../../domain/produto/model/produto.model';
import { SalvarProdutoRequest } from '../request/salvar-produto.request';
import { EditarProdutoRequest } from '../request/editar-produto.request';
import { IProdutoService } from '../../../../domain/produto/service/produto.service.interface';

@Controller('v1/produto')
@ApiTags('Produto')
@ApiConsumes('application/json')
@ApiProduces('application/json')
export class ProdutoController {
   private logger: Logger = new Logger(ProdutoController.name);

   constructor(@Inject('IService<Produto>') private service: IProdutoService) {}

   @Post()
   @ApiCreatedResponse({ description: 'Produto salvo com sucesso' })
   async save(@Body() request: SalvarProdutoRequest): Promise<Produto> {
      this.logger.debug(`Salvando Produto request: ${JSON.stringify(request)}`);
      return await this.service
         .save({
            nome: request.nome,
            idCategoriaProduto: request.idCategoriaProduto,
            descricao: request.descricao,
            preco: request.preco,
            imagemBase64: request.imagemBase64,
            ativo: true,
         })
         .then((produto) => {
            this.logger.log(`Produto salvo com sucesso: ${produto.id}}`);
            return produto;
         });
   }

   @Put(':id')
   @ApiCreatedResponse({ description: 'Produto editado com sucesso' })
   async edit(@Param('id') id: number, @Body() request: EditarProdutoRequest): Promise<Produto> {
      this.logger.debug(`Editando Produto request: ${JSON.stringify(request)}`);
      return await this.service
         .edit({
            id: request.id,
            nome: request.nome,
            idCategoriaProduto: request.idCategoriaProduto,
            descricao: request.descricao,
            preco: request.preco,
            imagemBase64: request.imagemBase64,
            ativo: true,
         })
         .then((produto) => {
            this.logger.log(`Produto editado com sucesso: ${produto.id}}`);
            return produto;
         });
   }

   @Delete(':id')
   @ApiResponse({ status: 200, description: 'Produto deletado com sucesso' })
   async delete(@Param('id') id: number): Promise<boolean> {
      this.logger.debug(`Deletando produto id: ${id}`);
      return await this.service.delete(id).then((result) => {
         this.logger.log(`Produto deletado com sucesso: ${id}}`);
         return result;
      });
   }

   @Get(':id')
   @ApiResponse({ status: 200, description: 'Produto encontrado com sucesso' })
   @ApiResponse({ status: 404, description: 'Produto não encontrado' })
   async findById(@Param('id') id: number): Promise<Produto> {
      this.logger.debug(`Procurando Produto id: ${id}`);
      return await this.service.findById(id).then((produto) => {
         if (produto) {
            this.logger.log(`Produto encontrado com sucesso: ${produto.id}}`);
            return produto;
         }
         this.logger.debug(`Produto não encontrado: ${id}`);
         throw new NotFoundException(`Produto não encontrado: ${id}}`);
      });
   }

   @Get('categoria/:id')
   @ApiResponse({ status: 200, description: 'Produtos encontrados com sucesso' })
   @ApiResponse({ status: 404, description: 'Produtos não encontrados' })
   async findByIdCategoriaProduto(@Param('id') id: number): Promise<Produto[]> {
      this.logger.debug(`Procurando Produtos para idCategoriaProduto: ${id}`);
      return await this.service.findByIdCategoriaProduto(id).then((produtos) => {
         if (produtos) {
            this.logger.debug(`Produtos encontrado com sucesso: ${JSON.stringify(produtos)}`);
            return produtos;
         }
         this.logger.debug(`Produtos não encontrados para idCategoriaProduto: ${id}`);
         throw new NotFoundException(`Produtos não encontrados para idCategoriaProduto: ${id}}`);
      });
   }
}
