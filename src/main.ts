import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as cookieParser from 'cookie-parser';

async function bootstrap() {

  const app = await NestFactory.create(AppModule);
  app.use(cookieParser());

  //SWAGGER
  //access via this: http://localhost:3000/api
  const config = new DocumentBuilder()
  .setTitle('DOT Library')
  .setDescription('Library Path Description')
  .setVersion('1.0')
  .addBearerAuth({
      type: 'http',
      scheme: 'bearer',
      bearerFormat: 'JWT',
      name: 'Authorization',
      in: 'header',
    },
    'access_token',)
  .addServer('http://localhost:3000/', 'Local environment')
  .addTag('Library')
  .build();
  const documentFactory = () => SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, documentFactory);

  await app.listen(process.env.PORT ?? 3000);
}

bootstrap();
