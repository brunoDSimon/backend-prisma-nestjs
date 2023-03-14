import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';
import { UnauthorizedInterceptor } from './common/erros/interceptors/unauthorized.interceptor';
import { notFoundInterceptor } from './common/erros/interceptors/notfound.interceptor';
import { DatabaseInterceptor } from './common/erros/interceptors/database.interceptor';
import { ConflictInterceptor } from './common/erros/interceptors/conflict.interceptor';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  // app.useGlobalFilters(new HttpExceptionFilter());
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );
  app.useGlobalInterceptors(new ConflictInterceptor());
  app.useGlobalInterceptors(new DatabaseInterceptor());
  app.useGlobalInterceptors(new UnauthorizedInterceptor());
  app.useGlobalInterceptors(new notFoundInterceptor());
  await app.listen(process.env.PORT || 3000);
}
bootstrap();
