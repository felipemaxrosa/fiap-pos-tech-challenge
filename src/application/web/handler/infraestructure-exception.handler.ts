import { Catch, HttpStatus } from '@nestjs/common';
import { InfraestructureException } from 'src/infrastructure/exception/infrastructure.exception';
import { ExceptionHandler } from './exception.handler';

@Catch(InfraestructureException)
export class InfraestructureExceptionHandler extends ExceptionHandler<InfraestructureException> {
  constructor() {
    super(HttpStatus.INTERNAL_SERVER_ERROR);
  }
}
