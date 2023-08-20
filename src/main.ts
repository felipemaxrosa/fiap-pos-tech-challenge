import { NestFactory } from '@nestjs/core';
import { Logger, ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { MainModule } from 'src/main.module';
import { ApplicationConstants } from 'src/presentation/constants/application.constants';
import { EnvUtils } from 'src/shared/env.utils';

async function bootstrap(): Promise<void> {
   const logger: Logger = new Logger(MainModule.name);

   // Configuração do servidor
   const serverPort = process.env.SERVER_PORT || 3000;
   const app = await NestFactory.create(MainModule);

   // Configuração de validações global inputs request
   app.useGlobalPipes(
      new ValidationPipe({
         stopAtFirstError: true,
      }),
   );

   // Configuração do swagger
   const options = new DocumentBuilder()
      .setTitle(ApplicationConstants.SWAGGER_TITLE)
      .setVersion(ApplicationConstants.SWAGGER_VERSION)
      .setDescription(ApplicationConstants.SWAGGER_DESCRIPTION)
      .setExternalDoc(
         ApplicationConstants.SWAGGER_EXTERNAL_DOC_DESCRIPTION,
         ApplicationConstants.SWAGGER_EXTERNAL_DOC_URL,
      )
      .build();

   logger.log('Configurando swagger');
   const document = SwaggerModule.createDocument(app, options);
   SwaggerModule.setup(ApplicationConstants.SWAGGER_PATH, app, document);

   // Server startup
   logger.log(`Configurando aplicação com as variáveis:`, EnvUtils.envs());
   await app.listen(serverPort);
   logger.log(`Servidor escutando na porta: ${serverPort}`);
}

bootstrap();
