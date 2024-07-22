import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as cookieParser from 'cookie-parser';
import { EnvService } from './infra/env/env-service';
import { IHashGenerator } from './core/crypt/hash-generator';
import { PrismaService } from './infra/db/prisma/prisma-service';
import { execSync } from 'child_process';

async function bootstrap() {
  execSync('npx prisma migrate deploy');

  const app = await NestFactory.create(AppModule);
  app.use(cookieParser());
  app.enableCors({ credentials: true });

  const env = app.get(EnvService);
  const port = env.get('PORT');

  const password = await app
    .get(IHashGenerator)
    .generate(env.get('ROOTUSER_PASSWORD'));

  await app.get(PrismaService).user.upsert({
    create: {
      email: env.get('ROOTUSER_EMAIL'),
      name: env.get('ROOTUSER_NAME'),
      password,
      role: 'ADMIN',
    },
    update: {},
    where: { email: env.get('ROOTUSER_EMAIL') },
  });

  await app.listen(port);
}

bootstrap();
