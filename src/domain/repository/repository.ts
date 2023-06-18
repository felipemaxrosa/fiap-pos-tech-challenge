export interface IRepository<T> {
   save(type: T): Promise<T>;
   findBy(attributes: Partial<T>): Promise<T[]>;
}
