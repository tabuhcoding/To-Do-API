import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ConfigModule } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const options = new DocumentBuilder()
    .setTitle('To-do-list API')
    .setDescription('The To-dolist API description')
    .setVersion('1.0')
    .build();
    
  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('api-docs', app, document);

  // const allowedOrigins = process.env.CORS_ALLOWED_ORIGINS?.split(',') || [];
  // console.log('Allowed origins:', allowedOrigins); 

  // app.enableCors({
  //   origin: '*',
  //   credentials: true,
  //   methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  //   allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  //   preflightContinue: false,
  //   optionsSuccessStatus: 204,
  // });
  const port = process.env.PORT || 8000;
  console.log(`🚀 Server is running on port ${port}`);
  await app.listen(port);
  console.log(`✅ Swagger available at http://localhost:${port}/api-docs`);

}

bootstrap();
