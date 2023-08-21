export interface IService<T> {
   save(type: T): Promise<T>;

   edit(type: T): Promise<T>;

   delete(id: number): Promise<boolean>;

   findById(id: number): Promise<T>;
}
