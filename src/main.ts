import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as timeout from 'connect-timeout';

async function bootstrap() {
  const PORT = process.env.PORT;
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe());
  app.enableCors();
  // app.use(timeout('2s'));
  // app.use(haltOnTimedout);
  await app.listen(PORT);
}

function haltOnTimedout(req, res, next) {
  if (!req.timedout) next();
}
bootstrap();
