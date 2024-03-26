import { AppModule } from '@/app.module';
import { TokenPayload } from '@/infra/auth/jwt-strategy';
import { DatabaseModule } from '@/infra/db/database.module';
import { INestApplication } from '@nestjs/common';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { Test, TestingModule } from '@nestjs/testing';
import { hash } from 'bcryptjs';
import supertest from 'supertest';
import { UserFactory } from 'test/factories/user-factory';

describe('UserController', () => {
  let app: INestApplication;
  let userFactory: UserFactory;
  let jwt: JwtService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UserFactory, JwtModule],
      imports: [AppModule, DatabaseModule],
    }).compile();

    app = module.createNestApplication();
    userFactory = module.get(UserFactory);
    jwt = module.get(JwtService);

    await app.init();
  });

  test('[POST] /user/new', async () => {
    const ROUTE = '/user/new';

    const adminUser = await userFactory.createAndPersist('admin', {
      name: 'Kaio',
      email: 'kaio@gmail.com',
      password: await hash('12345', 6),
    });

    const token = await jwt.signAsync({
      name: adminUser.name,
      role: adminUser.role,
      sub: adminUser.id.toValue(),
    } as TokenPayload);

    const result = await supertest(app.getHttpServer())
      .post(ROUTE)
      .set({ Authorization: `Bearer ${token}` })
      .send({
        name: 'Felipe',
        email: 'kaioFelipe@gmail.com',
        password: '123456',
      })
      .expect(201);

    expect(result.body.user).toMatchObject({
      id: expect.any(String),
      name: 'Felipe',
      email: 'kaioFelipe@gmail.com',
      role: 'EDITOR',
      createdAt: expect.any(String),
    });
  });
});
