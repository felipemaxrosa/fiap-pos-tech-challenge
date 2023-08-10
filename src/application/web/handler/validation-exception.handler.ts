import { Catch, HttpStatus } from '@nestjs/common';

import { ValidationException } from '../../../domain/exception/validation.exception';
import { ExceptionHandler } from './exception.handler';

@Catch(ValidationException)
export class ValidationExceptionHandler extends ExceptionHandler<ValidationException> {
   constructor() {
      super(HttpStatus.BAD_REQUEST);
   }
}
