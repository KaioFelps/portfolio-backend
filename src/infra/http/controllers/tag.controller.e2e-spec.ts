import supertest from 'supertest';
import { AppModule } from '@/app.module';
import { TokenPayload } from '@/infra/auth/jwt-strategy';
import { DatabaseModule } from '@/infra/db/database.module';
import { INestApplication } from '@nestjs/common';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { Test, TestingModule } from '@nestjs/testing';
import { UserFactory } from 'test/factories/user-factory';
import { TagFactory } from 'test/factories/tag-factory';
import { QUANTITY_PER_PAGE } from '@/core/pagination-consts';
import { PrismaService } from '@/infra/db/prisma/prisma-service';
import { DomainEvents } from '@/core/events/domain-events';

describe('TagController', () => {
  let app: INestApplication;
  let userFactory: UserFactory;
  let tagFactory: TagFactory;
  let prisma: PrismaService;
  let jwt: JwtService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [UserFactory, JwtModule, TagFactory, PrismaService],
    }).compile();

    app = module.createNestApplication();
    userFactory = module.get(UserFactory);
    tagFactory = module.get(TagFactory);
    prisma = module.get(PrismaService);
    jwt = module.get(JwtService);

    await app.init();
  });

  afterEach(() => {
    DomainEvents.AggregateEvent['clearEveryAggregateEvent!']();
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

  test('[GET] /tag/list', async () => {
    for (let i = 0; i <= 14; i++) {
      await tagFactory.createAndPersist({ value: `tag-${i + 1}` });
    }

    const response = await supertest(app.getHttpServer())
      .get('/tag/list?page=2')
      .send()
      .expect(200);

    expect(response.body).toMatchObject({
      tags: expect.any(Array),
      totalCount: 15,
      page: 2,
      perPage: QUANTITY_PER_PAGE,
    });

    expect(response.body.tags.length).toBe(3);
  });

  test('[PATCH] /tag/:id/edit', async () => {
    const user = await userFactory.createAndPersist('admin');
    const token = await jwt.signAsync({
      name: user.name,
      role: user.role,
      sub: user.id.toValue(),
    });

    const tag = await tagFactory.createAndPersist({ value: 'front end' });

    const response = await supertest(app.getHttpServer())
      .patch(`/tag/${tag.id.toValue()}/edit`)
      .set({ Authorization: `Bearer ${token}` })
      .send({
        value: 'rust',
      })
      .expect(200);

    const tagOnDb = await prisma.tag.findUnique({
      where: { id: tag.id.toValue() },
    });

    expect(tagOnDb!.value).toEqual('rust');
    expect(response.body.tag).toMatchObject({
      id: tag.id.toValue(),
      value: 'rust',
    });
  });

  test('[DELETE] /tag/:id/delete', async () => {
    const user = await userFactory.createAndPersist('admin');
    const token = await jwt.signAsync({
      name: user.name,
      role: user.role,
      sub: user.id.toValue(),
    });

    const tag = await tagFactory.createAndPersist();

    await supertest(app.getHttpServer())
      .delete(`/tag/${tag.id.toValue()}/delete`)
      .set({ Authorization: `Bearer ${token}` })
      .send()
      .expect(204);

    const tagOnDb = await prisma.tag.findMany();

    expect(tagOnDb.length).toBe(0);
  });
});
