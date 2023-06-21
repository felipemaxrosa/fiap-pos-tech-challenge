import { Body, Controller, Inject, Logger, Param, Post, Put } from '@nestjs/common';
import { IService } from 'src/domain/service/service';
import { ApiConsumes, ApiCreatedResponse, ApiProduces, ApiTags } from '@nestjs/swagger';
import { Produto } from '../../../../domain/produto/model/produto.model';
import { SalvarProdutoRequest } from '../request/salvar-produto.request';
import { EditarProdutoRequest } from '../request/editar-produto.request';

@Controller('v1/produto')
@ApiTags('Produto')
@ApiConsumes('application/json')
@ApiProduces('application/json')
export class ProdutoController {
   private logger: Logger = new Logger(ProdutoController.name);

   constructor(@Inject('IService<Produto>') private service: IService<Produto>) {}

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
            imagemBase64: '',
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
            imagemBase64: '',
            ativo: true,
         })
         .then((produto) => {
            this.logger.log(`Produto editado com sucesso: ${produto.id}}`);
            return produto;
         });
   }
   /*
   @Delete(':id')
   @ApiNoContentResponse({ description: 'Produto deletado com sucesso' })
   async delete(@Param('id') id: number): Promise<void> {
      this.logger.debug(`Deletando produto id: ${id}`);
      await this.service.delete(id).then(() => {
         this.logger.log(`Produto editado com sucesso: ${id}}`);
      });
   }*/
}
