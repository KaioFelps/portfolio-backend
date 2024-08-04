import { AppModule } from '@/app.module';
import { DomainEvents } from '@/core/events/domain-events';
import { TokenPayload } from '@/infra/auth/jwt-strategy';
import { DatabaseModule } from '@/infra/db/database.module';
import { INestApplication } from '@nestjs/common';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { Test, TestingModule } from '@nestjs/testing';
import supertest from 'supertest';
import { PostFactory } from 'test/factories/post-factory';
import { ProjectFactory } from 'test/factories/project-factory';
import { UserFactory } from 'test/factories/user-factory';

describe('StatisticController', () => {
  let app: INestApplication;
  let userFactory: UserFactory;
  let projectFactory: ProjectFactory;
  let postFactory: PostFactory;
  let jwt: JwtService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [UserFactory, ProjectFactory, PostFactory, JwtModule],
    }).compile();

    app = module.createNestApplication();
    userFactory = module.get(UserFactory);
    projectFactory = module.get(ProjectFactory);
    postFactory = module.get(PostFactory);
    jwt = module.get(JwtService);

    await app.init();
  });

  afterEach(() => {
    DomainEvents.AggregateEvent['clearEveryAggregateEvent!']();
  });

  test('[GET] /statistics/count', async () => {
    const user = await userFactory.createAndPersist('admin');
    const token = await jwt.signAsync({
      name: user.name,
      role: user.role,
      sub: user.id.toValue(),
    } as TokenPayload);

    for (let i = 0; i <= 3; i++) {
      await projectFactory.createAndPersist();
    }

    for (let i = 0; i <= 2; i++) {
      await postFactory.createAndPersist({ authorId: user.id });
    }

    await supertest(app.getHttpServer())
      .get('/statistics/count')
      .send()
      .expect(401);

    const response = await supertest(app.getHttpServer())
      .get('/statistics/count')
      .set({ Authorization: `Bearer ${token}` })
      .send()
      .expect(200);

    expect(response.body).toMatchObject({
      totalPosts: 3,
      totalProjects: 4,
    });
  });
});
