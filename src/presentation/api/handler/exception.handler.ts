import { ArgumentsHost, ExceptionFilter, HttpStatus, Logger } from '@nestjs/common';

export abstract class ExceptionHandler<T extends Error> implements ExceptionFilter<T> {
   private logger = new Logger(ExceptionHandler.name);

   constructor(private httpStatus: HttpStatus, private message?: string) {}

   catch(exception: T, host: ArgumentsHost): any {
      this.logger.error(
         `Houve um erro durante a execução HTTP: ${exception.message}: Details: ${JSON.stringify(
            exception['response'],
         )}`,
         exception,
      );

      const context = host.switchToHttp();
      const request = context.getRequest();
      const response = context.getResponse();

      const exceptionDetails = exception['response'];

      if (exceptionDetails) {
         this.httpStatus = exceptionDetails['statusCode'];
         this.message = exceptionDetails['message'];
      }

      response.status(this.httpStatus ?? exception['status']).json({
         status: this.httpStatus ?? exception['status'],
         message: this.message ?? exception.message,
         timestamp: new Date().toISOString(),
         path: request.url,
      });
   }
}
