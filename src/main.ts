import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { Logger } from 'nestjs-pino';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { bufferLogs: true });
  app.useLogger(app.get(Logger));
  app.useGlobalPipes(new ValidationPipe());

  const config = new DocumentBuilder()
    .setTitle('ContaCerta API')
    .setDescription(
      'RESTful API for managing finances and generating charts based on the information.',
    )
    .setVersion('1.0')
    .build();
  const documentFactory = () => SwaggerModule.createDocument(app, config);

  const swaggerOptions = {
    customSiteTitle: 'ContaCerta API Docs',
    customfavIcon: '/images/symbol.ico',
    customCss: `
      .swagger-ui .topbar { background-color: #000000; }
      #logo_small_svg__SW_TM-logo-on-dark { display: none; }
      .swagger-ui .topbar .topbar-wrapper::before {
        content: '';
        background-image: url('/images/logo.ico'); 
        background-repeat: no-repeat;
        background-size: contain;
        height: 90px; 
        width: 230px;
        display: inline-block;
        margin-right: 10px;
      }
    `,
  };

  SwaggerModule.setup('docs', app, documentFactory, swaggerOptions);

  await app.listen(3000);
}
bootstrap();
