import { Body, Controller, Inject, Logger, Post } from '@nestjs/common';
import { IService } from 'src/domain/service/service';
import { ApiConsumes, ApiCreatedResponse, ApiProduces, ApiTags } from '@nestjs/swagger';
import { Produto } from '../../../../domain/produto/model/produto.model';
import { SalvarProdutoRequest } from '../request/salvar-produto.request';

@Controller('v1/produto')
@ApiTags('Produto')
@ApiConsumes('application/json')
@ApiProduces('application/json')
export class ProdutoController {
   private logger: Logger = new Logger(ProdutoController.name);

   constructor(@Inject('IService<Produto>') private service: IService<Produto>) {}

   @Post()
   @ApiCreatedResponse({ description: 'Produto salvo com sucesso' })
   async salvar(@Body() request: SalvarProdutoRequest): Promise<Produto> {
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
}
