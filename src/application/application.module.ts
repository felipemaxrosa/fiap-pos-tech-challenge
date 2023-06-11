import { Module } from '@nestjs/common';
import { DomainModule } from 'src/domain/domain.module';
import { APP_FILTER } from '@nestjs/core';
import { InfraestructureExceptionHandler } from './web/handler/infraestructure-exception.handler';
import { ValidationExceptionHandler } from './web/handler/validation-exception.handler';
import { ClientController } from './web/cliente/controller/cliente.controller';
import { InfrastructureModule } from 'src/infrastructure/infrastructure.module';

@Module({
    imports:[
        InfrastructureModule,
        DomainModule,
    ],
    providers:[
        {provide: APP_FILTER, useClass: InfraestructureExceptionHandler},
        {provide: APP_FILTER, useClass: ValidationExceptionHandler},

    ],
    controllers: [ClientController]
})
export class ApplicationModule {}
