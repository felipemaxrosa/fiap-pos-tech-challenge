import { ArgumentsHost, ExceptionFilter, HttpStatus, Logger } from "@nestjs/common";

export abstract class ExceptionHandler<T extends Error> implements ExceptionFilter<T>{
    
    private logger = new Logger(ExceptionHandler.name);

    constructor(private httpStatus: HttpStatus){
        this.httpStatus= httpStatus
    }

    catch(exception: T, host: ArgumentsHost) {

        this.logger.error(`Houve um erro durante a execução HTTP: ${exception.message}`)

        const context = host.switchToHttp();
        const request = context.getRequest();
        const response = context.getResponse();
    
        response.status(this.httpStatus).json({
            status: this.httpStatus,
            message: exception.message,
            timestamp: new Date().toISOString(),
            path: request.url,
        })
    }
}