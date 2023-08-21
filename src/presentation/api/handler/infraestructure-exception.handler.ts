import { Catch, HttpStatus } from '@nestjs/common';
import { InfraestructureException } from 'src/infrastructure/exception/infrastructure.exception';
import { ExceptionHandler } from 'src/presentation/api/handler/exception.handler';

@Catch(InfraestructureException)
export class InfraestructureExceptionHandler extends ExceptionHandler<InfraestructureException> {
   constructor() {
      super(HttpStatus.INTERNAL_SERVER_ERROR);
   }
}
