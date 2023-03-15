import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { UnauthorizedInterceptor } from './common/erros/interceptors/unauthorized.interceptor';
import { notFoundInterceptor } from './common/erros/interceptors/notfound.interceptor';
import { DatabaseInterceptor } from './common/erros/interceptors/database.interceptor';
import { ConflictInterceptor } from './common/erros/interceptors/conflict.interceptor';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

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
  const config = new DocumentBuilder()
    .setTitle('Teste swagger ui')
    .setDescription('Estudos com nestjs')
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('swagger', app, document);
  await app.listen(process.env.PORT || 3000);
}
bootstrap();
