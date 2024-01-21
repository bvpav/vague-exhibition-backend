import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { CategoryService } from './project/category/category.service';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableVersioning();
  const categoryService = app.get(CategoryService);
  const categories = await categoryService.findAll();
  console.log(categories);
  await app.listen(3000);
}

void bootstrap();
