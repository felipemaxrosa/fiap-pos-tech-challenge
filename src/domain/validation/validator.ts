export interface IValidator<T> {
  validate(type: T): Promise<boolean>;
}
