import { Catch, HttpStatus } from '@nestjs/common';
import { ValidationException } from 'src/enterprise/exception/validation.exception';
import { ExceptionHandler } from 'src/presentation/web/handler/exception.handler';

@Catch(ValidationException)
export class ValidationExceptionHandler extends ExceptionHandler<ValidationException> {
   constructor() {
      super(HttpStatus.BAD_REQUEST);
   }
}
