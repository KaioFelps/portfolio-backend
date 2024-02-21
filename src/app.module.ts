import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DatabaseModule } from './infra/db/database.module';
import { AuthModule } from './infra/auth/auth.module';
import { EnvModule } from './infra/env/env.module';
import { ConfigModule } from '@nestjs/config';
import { envSchema } from './infra/env/env';

@Module({
  imports: [
    ConfigModule.forRoot({
      validate: (env) => envSchema.parse(env),
      isGlobal: true,
    }),
    DatabaseModule,
    AuthModule,
    EnvModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
