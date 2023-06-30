import {
   ApiBadRequestResponse,
   ApiConsumes,
   ApiInternalServerErrorResponse,
   ApiNotFoundResponse,
   ApiProduces,
} from '@nestjs/swagger';
import { ErroResponse } from './response/erro.response';

@ApiConsumes('application/json')
@ApiProduces('application/json')
@ApiNotFoundResponse({ type: ErroResponse })
@ApiBadRequestResponse({ type: ErroResponse })
@ApiInternalServerErrorResponse({ type: ErroResponse })
export abstract class BaseController {}
