import { Catch, HttpException } from '@nestjs/common';
import { ValidationException } from 'src/enterprise/exception/validation.exception';
import { ExceptionHandler } from 'src/presentation/rest/handler/exception.handler';

@Catch(HttpException)
export class GeneralHttpExceptionHandler extends ExceptionHandler<ValidationException> {}
