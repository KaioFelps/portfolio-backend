import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as cookieParser from 'cookie-parser';
import { EnvService } from './infra/env/env-service';
import { IHashGenerator } from './core/crypt/hash-generator';
import { PrismaService } from './infra/db/prisma/prisma-service';
import { run } from 'prisma/seed';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(cookieParser());
  app.enableCors({ credentials: true });

  const env = app.get(EnvService);
  const port = env.get('PORT');

  // seed the database
  if (env.get('NODE_ENV') === 'development' && env.get('RUN_DB_SEED')) {
    await run(app.get(PrismaService), app.get(IHashGenerator));
  }

  // create or update the root user
  try {
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
  } catch {}

  await app.listen(port);
}

bootstrap();
