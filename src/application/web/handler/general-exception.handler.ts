import { Catch, HttpStatus } from "@nestjs/common";
import { ValidationException } from "src/domain/exception/validation-domain-exception";
import { ExceptionHandler } from "./exception.handler";

@Catch(Error)
export class GeneralExceptionHandler extends ExceptionHandler<ValidationException> {
    
    constructor(){
        super(HttpStatus.INTERNAL_SERVER_ERROR, "Houve um erro genérico ao processar a requisição");
    }
}