export interface IService<T> {
   save(type: T): Promise<T>;
}
