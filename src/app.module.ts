import { Module, ValidationPipe } from '@nestjs/common';
import { AppService } from './app.service';
import { AuthModule } from './infra/auth/auth.module';
import { EnvModule } from './infra/env/env.module';
import { ConfigModule } from '@nestjs/config';
import { envSchema } from './infra/env/env';
import { HttpModule } from './infra/http/http.module';
import { APP_PIPE } from '@nestjs/core';
import { EventsModule } from './infra/events/events.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      validate: (env) => envSchema.parse(env),
      isGlobal: true,
    }),
    AuthModule,
    { module: EnvModule, global: true },
    HttpModule,
    EventsModule,
  ],
  providers: [
    AppService,
    {
      provide: APP_PIPE,
      useFactory: () => {
        return new ValidationPipe({
          transform: true,
          transformOptions: { enableImplicitConversion: true },
          forbidNonWhitelisted: true,
          stopAtFirstError: true,
        });
      },
    },
  ],
})
export class AppModule {}
