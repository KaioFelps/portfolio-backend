import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { UserFactory } from 'test/factories/user-factory';
import { AppModule } from '@/app.module';
import { DatabaseModule } from '@/infra/db/database.module';
import request from 'supertest';
import { hash } from 'bcryptjs';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { TokenPayload } from '@/infra/auth/jwt-strategy';
import cookieParser from 'cookie-parser';
import { DomainEvents } from '@/core/events/domain-events';

describe('AuthController', () => {
  let app: INestApplication;
  let userFactory: UserFactory;
  let jwt: JwtService;

  afterEach(() => {
    DomainEvents.AggregateEvent['clearEveryAggregateEvent!']();
  });

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UserFactory, JwtModule],
      imports: [AppModule, DatabaseModule],
    }).compile();

    app = module.createNestApplication();
    app.use(cookieParser());
    app.enableCors({ credentials: true });
    userFactory = module.get(UserFactory);
    jwt = module.get(JwtService);

    await app.init();
  });

  test('[POST] /auth/login', async () => {
    const ROUTE = '/auth/login';

    const user = await userFactory.createAndPersist('editor', {
      email: 'kaio@gmail.com',
      password: await hash('12345678910comerpasteis', 6),
    });

    const invalidEmailResponse = await request(app.getHttpServer())
      .post(ROUTE)
      .send({
        email: 'kaiofelipe',
        password: '12345678910comerpasteis',
      });

    expect(invalidEmailResponse.statusCode).toBe(400);

    const wrongPasswordResponse = await request(app.getHttpServer())
      .post(ROUTE)
      .send({
        email: 'kaio@gmail.com',
        password: '123',
      });

    expect(wrongPasswordResponse.statusCode).toBe(401);

    const successResponse = await request(app.getHttpServer())
      .post(ROUTE)
      .send({
        email: 'kaio@gmail.com',
        password: '12345678910comerpasteis',
      })
      .expect(200);

    expect(successResponse.body).toMatchObject({
      accessToken: expect.any(String),
      user: expect.objectContaining({
        id: user.id.toValue(),
        name: user.name,
        role: user.role,
      }),
    });
  });

  test('[PATCH] /auth/refresh', async () => {
    const ROUTE = '/auth/refresh';

    const user = await userFactory.createAndPersist('editor', {
      email: 'kaio2@gmail.com',
      password: await hash('12345678910comerpasteis', 6),
    });

    const loginResponse = await request(app.getHttpServer())
      .post('/auth/login')
      .send({
        email: 'kaio2@gmail.com',
        password: '12345678910comerpasteis',
      });

    const refreshCookie = loginResponse.header['set-cookie'];

    const refreshResponse = await request(app.getHttpServer())
      .patch(ROUTE)
      .set('Cookie', [...refreshCookie])
      .withCredentials(true)
      .send()
      .expect(200);

    expect(refreshResponse.body).toMatchObject({
      accessToken: expect.any(String),
      user: expect.objectContaining({
        id: user.id.toValue(),
        name: user.name,
        role: user.role,
      }),
    });

    expect(refreshResponse.get('Set-Cookie')).toEqual([
      expect.stringContaining('refresh_token'),
    ]);
  });

  test('[POST] /auth/logout', async () => {
    const ROUTE = '/auth/logout';

    const user = await userFactory.createAndPersist('editor', {
      email: 'kaio3@gmail.com',
      password: await hash('12345678910comerpasteis', 6),
    });

    const token = await jwt.signAsync(
      {
        name: user.name,
        role: user.role,
        sub: user.id.toValue(),
      } as TokenPayload,
      {
        expiresIn: '10h',
      },
    );

    const logoutResponse = await request(app.getHttpServer())
      .post(ROUTE)
      .set({ Authorization: `Bearer ${token}` })
      .send()
      .expect(204);

    expect(logoutResponse.get('Set-Cookie')).toEqual([
      expect.stringContaining('refresh_token=;'),
    ]);
  });
});
