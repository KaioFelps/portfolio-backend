import supertest from 'supertest';
import { AppModule } from '@/app.module';
import { TokenPayload } from '@/infra/auth/jwt-strategy';
import { DatabaseModule } from '@/infra/db/database.module';
import { INestApplication } from '@nestjs/common';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { Test, TestingModule } from '@nestjs/testing';
import { UserFactory } from 'test/factories/user-factory';

describe('TagController', () => {
  let app: INestApplication;
  let userFactory: UserFactory;
  let jwt: JwtService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [UserFactory, JwtModule],
    }).compile();

    app = module.createNestApplication();
    userFactory = module.get(UserFactory);
    jwt = module.get(JwtService);

    await app.init();
  });

  test('[POST] /tag/new', async () => {
    const user = await userFactory.createAndPersist('admin');
    const token = await jwt.signAsync({
      name: user.name,
      role: user.role,
      sub: user.id.toValue(),
    } as TokenPayload);

    const response = await supertest(app.getHttpServer())
      .post('/tag/new')
      .set({ Authorization: `Bearer ${token}` })
      .send({
        value: 'Foo',
      })
      .expect(201);

    expect(response.body).toEqual({
      tag: expect.objectContaining({
        id: expect.any(String),
        value: 'Foo',
      }),
    });
  });
});
