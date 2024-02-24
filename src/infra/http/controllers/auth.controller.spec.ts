import { Test, TestingModule } from '@nestjs/testing';
import { HttpStatus, INestApplication } from '@nestjs/common';
import { UserFactory } from 'test/factories/user-factory';
import { AppModule } from '@/app.module';
import { DatabaseModule } from '@/infra/db/database.module';
import request from 'supertest';
import { hash } from 'bcryptjs';

describe('AuthController', () => {
  let app: INestApplication;
  let userFactory: UserFactory;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UserFactory],
      imports: [AppModule, DatabaseModule],
    }).compile();

    app = module.createNestApplication();
    userFactory = module.get(UserFactory);

    await app.init();
  });

  test('[POST] /auth/login', async () => {
    const ROUTE = '/auth/login';

    await userFactory.createAndPersist('editor', {
      email: 'kaio@gmail.com',
      password: await hash('12345678910comerpasteis', 8),
    });

    let response = await request(app.getHttpServer()).post(ROUTE).send({
      email: 'kaiofelipe',
      password: '12345678910comerpasteis',
    });

    expect(response.statusCode).toBe(400);

    response = await request(app.getHttpServer()).post(ROUTE).send({
      email: 'kaio@gmail.com',
      password: '123',
    });

    expect(response.statusCode).toBe(401);

    response = await request(app.getHttpServer).post(ROUTE).send({
      email: 'kaio@gmail.com',
      password: '12345678910comerpasteis',
    });

    expect(response.statusCode).toBe(HttpStatus.OK);
    expect(response.body.access_token).toEqual(expect.any(String));
  });
});
