export abstract class IService<T> {
    abstract save(type: T): Promise<T>;
}