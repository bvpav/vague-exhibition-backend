import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableVersioning();

  const config = new DocumentBuilder()
    .setTitle('NestJS Example')
    .setDescription('An example NestJS application')
    .setVersion('2.0')
    .addTag('projects')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);
  await app.listen(3000);
}

void bootstrap();
