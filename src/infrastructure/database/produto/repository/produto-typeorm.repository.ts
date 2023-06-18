import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Injectable, Logger } from '@nestjs/common';

import { Produto } from '../../../../domain/produto/model/produto.model';
import { IRepository } from '../../../../domain/repository/repository';
import { ProdutoEntity } from '../entity/produto.entity';
import { RepositoryException } from '../../../exception/repository.exception';

@Injectable()
export class ProdutoTypeormRepository implements IRepository<Produto> {
   private logger: Logger = new Logger(ProdutoTypeormRepository.name);

   constructor(
      @InjectRepository(ProdutoEntity)
      private repository: Repository<ProdutoEntity>,
   ) {}

   async findBy(attributes: any): Promise<Produto[]> {
      this.logger.debug(`Realizando consulta de produto: com os parâmetros ${JSON.stringify(attributes)}`);
      return this.repository
         .findBy(attributes)
         .then((produtoEntities) => {
            this.logger.debug(
               `Consulta de produto realizada com sucesso com os parâmetros: '${JSON.stringify(attributes)}'`,
            );
            return produtoEntities.map((produtoEntity) => ({
               id: produtoEntity.id,
               nome: produtoEntity.nome,
               idCategoriaProduto: produtoEntity.idCategoriaProduto,
               descricao: produtoEntity.descricao,
               preco: produtoEntity.preco,
               imagemBase64: produtoEntity.imagemBase64,
               ativo: produtoEntity.ativo,
            }));
         })
         .catch((error) => {
            throw new RepositoryException(
               `Houve um erro ao buscar o produto com os parâmetros: '${JSON.stringify(attributes)}': ${error.message}`,
            );
         });
   }

   async save(produto: Produto): Promise<Produto> {
      this.logger.debug(`Salvando produto: ${produto}`);
      return this.repository
         .save({
            nome: produto.nome,
            idCategoriaProduto: produto.idCategoriaProduto,
            descricao: produto.descricao,
            preco: produto.preco,
            imagemBase64: produto.imagemBase64,
            ativo: produto.ativo,
         })
         .then((produtoEntity) => {
            this.logger.debug(`Produto salvo com sucesso no banco de dados: ${produtoEntity.id}`);
            return {
               id: produtoEntity.id,
               nome: produtoEntity.nome,
               idCategoriaProduto: produtoEntity.idCategoriaProduto,
               descricao: produtoEntity.descricao,
               preco: produtoEntity.preco,
               imagemBase64: produtoEntity.imagemBase64,
               ativo: produtoEntity.ativo,
            };
         })
         .catch((error) => {
            throw new RepositoryException(
               `Houve um erro ao salvar o produto no banco de dados: '${produto}': ${error.message}`,
            );
         });
   }
}
