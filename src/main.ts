import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import session from 'express-session';
import cookieParser from 'cookie-parser';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
async function bootstrap() {

  const app = await NestFactory.create(AppModule);

  // cors options
  app.enableCors({
    origin: process.env.FRONT_URL,
    credentials: true,
  });

  // pipes
  app.useGlobalPipes(new ValidationPipe({
    disableErrorMessages: true,
  }));

  // cookie handler
  app.use(
    session({
      secret: process.env.SESSION_SECRET,
      resave: false,
      saveUninitialized: false,
    }),
  );
  app.use(cookieParser());
  
  // swagger
  const config = new DocumentBuilder()
    .setTitle('API JO')
    .setDescription('API des jo (projet personnel)')
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('swagger', app, document);

  await app.listen(3000);
}
bootstrap();
