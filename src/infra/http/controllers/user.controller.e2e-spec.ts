import { AppModule } from '@/app.module';
import { TokenPayload } from '@/infra/auth/jwt-strategy';
import { DatabaseModule } from '@/infra/db/database.module';
import { PrismaService } from '@/infra/db/prisma/prisma-service';
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
  let prisma: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UserFactory, JwtModule],
      imports: [AppModule, DatabaseModule],
    }).compile();

    app = module.createNestApplication();
    userFactory = module.get(UserFactory);
    jwt = module.get(JwtService);
    prisma = module.get(PrismaService);

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

  test('[GET] /user/list', async () => {
    const adminUser = await userFactory.createAndPersist('admin');
    const token = await jwt.signAsync({
      name: adminUser.name,
      role: adminUser.role,
      sub: adminUser.id.toValue(),
    });

    for (let i = 0; i < 14; i++) {
      await userFactory.createAndPersist('editor');
    }

    const response = await supertest(app.getHttpServer())
      .get('/user/list?page=2')
      .set({ Authorization: `Bearer ${token}` })
      .send()
      .expect(200);

    expect(response.body).toMatchObject({
      users: expect.any(Array),
      totalCount: 15,
      page: 2,
      perPage: 12,
    });

    expect(response.body.users.length).toBe(3);
  });

  test('[PUT] /user/:id/edit', async () => {
    const adminUser = await userFactory.createAndPersist('admin', {
      name: 'Kaio',
      email: 'kaio2@gmail.com',
      password: await hash('123456', 6),
    });

    const token = await jwt.signAsync({
      name: adminUser.name,
      role: adminUser.role,
      sub: adminUser.id.toValue(),
    });

    const anotherUser = await userFactory.createAndPersist('editor');

    await supertest(app.getHttpServer())
      .put(`/user/${anotherUser.id.toValue()}/edit`)
      .set({ Authorization: `Bearer ${token}` })
      .send({
        name: 'Nome editado',
        role: 'ADMIN',
      })
      .expect(204);

    const userOnDb = await prisma.user.findFirst({
      where: {
        id: anotherUser.id.toValue(),
      },
    });

    expect(userOnDb?.name).toEqual('Nome editado');
    expect(userOnDb?.role).toEqual('ADMIN');
  });

  test('[DELETE] /user/:id/delete', async () => {
    const adminUser = await userFactory.createAndPersist('admin');
    const anotherUser = await userFactory.createAndPersist('editor');

    const token = await jwt.signAsync({
      name: adminUser.name,
      role: adminUser.role,
      sub: adminUser.id.toValue(),
    });

    await supertest(app.getHttpServer())
      .delete(`/user/${anotherUser.id.toValue()}/delete`)
      .set({ Authorization: `Bearer ${token}` })
      .send()
      .expect(204);

    const userOnDb = await prisma.user.findFirst({
      where: {
        id: anotherUser.id.toValue(),
      },
    });

    expect(userOnDb).toBeNull();
  });
});
