import { Catch, HttpException, HttpStatus } from "@nestjs/common";
import { ValidationException } from "src/domain/exception/validation.exception";
import { ExceptionHandler } from "./exception.handler";

@Catch(HttpException)
export class GeneralHttpExceptionHandler extends ExceptionHandler<ValidationException> {
    
}