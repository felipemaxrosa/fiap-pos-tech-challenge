import { IValidator } from 'src/enterprise/validation/validator';

export class ValidatorUtils {
   static async executeValidators(validators: IValidator<any>[], model: any): Promise<void> {
      for (const validator of validators) {
         await validator.validate(model);
      }
   }
}
