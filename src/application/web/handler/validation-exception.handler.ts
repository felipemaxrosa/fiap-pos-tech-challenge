import { Catch, HttpStatus } from "@nestjs/common";
import { ValidationException } from "src/domain/exception/validation-domain-exception";
import { ExceptionHandler } from "./exception.handler";

@Catch(ValidationException)
export class ValidationExceptionHandler extends ExceptionHandler<ValidationException> {
    
    constructor(){
        super(HttpStatus.BAD_REQUEST);
    }
}