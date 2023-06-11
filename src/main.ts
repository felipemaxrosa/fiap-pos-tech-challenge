import { NestFactory } from '@nestjs/core';
import { MainModule } from './main.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { Logger } from '@nestjs/common';
import { EnvUtils } from './shared/env.utils';
import { ApplicationConstants } from './application/constants/application.constants';

async function bootstrap() {
  
  const logger: Logger = new Logger(MainModule.name)
  
  // Configuração do servidor
  const serverPort = process.env.SERVER_PORT || 3000;
  const app = await NestFactory.create(MainModule);

  // Configuração do swagger
  const options = new DocumentBuilder()
    .setTitle(ApplicationConstants.SWAGGER_TITLE)
    .setVersion(ApplicationConstants.SWAGGER_VERSION)
    .setDescription(ApplicationConstants.SWAGGER_DESCRIPTION)
    .build();

  logger.log('Configurando swagger');
  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup(ApplicationConstants.SWAGGER_PATH, app, document)

  // Server startup
  logger.log(`Configurando aplicação com as variáveis:`, EnvUtils.envs())
  await app.listen(serverPort);
  logger.log(`Servidor escutando na porta: ${serverPort}`);
}

bootstrap();
