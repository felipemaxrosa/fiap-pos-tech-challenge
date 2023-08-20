import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Injectable, Logger } from '@nestjs/common';
import { Produto } from 'src/enterprise/produto/model/produto.model';
import { IRepository } from 'src/enterprise/repository/repository';
import { RepositoryException } from 'src/infrastructure/exception/repository.exception';
import { ProdutoEntity } from 'src/infrastructure/persistence/produto/entity/produto.entity';

@Injectable()
export class ProdutoTypeormRepository implements IRepository<Produto> {
   private logger: Logger = new Logger(ProdutoTypeormRepository.name);

   constructor(
      @InjectRepository(ProdutoEntity)
      private repository: Repository<ProdutoEntity>,
   ) {}

   async findBy(attributes: Partial<Produto>): Promise<Produto[]> {
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

   async edit(produto: Produto): Promise<Produto> {
      this.logger.debug(`Editando produto: ${produto}`);
      return this.repository
         .save({
            id: produto.id,
            nome: produto.nome,
            idCategoriaProduto: produto.idCategoriaProduto,
            descricao: produto.descricao,
            preco: produto.preco,
            imagemBase64: produto.imagemBase64,
            ativo: produto.ativo,
         })
         .then((produtoEntity) => {
            this.logger.debug(`Produto editado com sucesso no banco de dados: ${produtoEntity.id}`);
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
               `Houve um erro ao editar o produto no banco de dados: '${produto}': ${error.message}`,
            );
         });
   }

   async delete(id: number): Promise<boolean> {
      this.logger.debug(`Deletando logicamente produto id: ${id}`);
      const produto = (await this.findBy({ id: id }))[0];
      return this.repository
         .save({
            id: produto.id,
            nome: produto.nome,
            idCategoriaProduto: produto.idCategoriaProduto,
            descricao: produto.descricao,
            preco: produto.preco,
            imagemBase64: produto.imagemBase64,
            ativo: false,
         })
         .then((produtoEntity) => {
            this.logger.debug(`Produto deletado logicamente com sucesso no banco de dados: ${produtoEntity.id}`);
            return true;
         })
         .catch((error) => {
            throw new RepositoryException(
               `Houve um erro ao deletar logicamente o produto no banco de dados: '${produto}': ${error.message}`,
            );
         });
   }

   findAll(): Promise<Produto[]> {
      throw new RepositoryException('Método não implementado.');
   }
}
