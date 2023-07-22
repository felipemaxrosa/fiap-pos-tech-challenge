import { Catch, HttpException } from '@nestjs/common';

import { ValidationException } from '../../../domain/exception/validation.exception';
import { ExceptionHandler } from './exception.handler';

@Catch(HttpException)
export class GeneralHttpExceptionHandler extends ExceptionHandler<ValidationException> {}
