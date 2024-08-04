import { AppModule } from '@/app.module';
import { DomainEvents } from '@/core/events/domain-events';
import { Log, LogAction, LogTargetType } from '@/domain/logs/entities/log';
import { TokenPayload } from '@/infra/auth/jwt-strategy';
import { DatabaseModule } from '@/infra/db/database.module';
import { INestApplication } from '@nestjs/common';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { Test, TestingModule } from '@nestjs/testing';
import supertest from 'supertest';
import { LogFactory } from 'test/factories/log-factory';
import { UserFactory } from 'test/factories/user-factory';

describe('LogController', () => {
  let app: INestApplication;
  let userFactory: UserFactory;
  let logFactory: LogFactory;
  let jwt: JwtService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [UserFactory, LogFactory, JwtModule],
    }).compile();

    app = module.createNestApplication();
    userFactory = module.get(UserFactory);
    logFactory = module.get(LogFactory);
    jwt = module.get(JwtService);

    await app.init();
  });

  afterEach(() => {
    DomainEvents.AggregateEvent['clearEveryAggregateEvent!']();
  });

  test('[GET] /log/list', async () => {
    const user = await userFactory.createAndPersist('admin');

    const token = await jwt.signAsync({
      name: user.name,
      role: user.role,
      sub: user.id.toValue(),
    } as TokenPayload);

    await Promise.all([
      logFactory.createAndPersist({
        dispatcherId: user.id,
        targetType: LogTargetType.project,
        action: LogAction.updated,
      }),

      logFactory.createAndPersist({
        dispatcherId: user.id,
        targetType: LogTargetType.post,
        action: LogAction.created,
      }),
    ]);

    const log: Log = await new Promise((resolve) => {
      setTimeout(() => {
        return resolve(
          logFactory.createAndPersist({
            dispatcherId: user.id,
            targetType: LogTargetType.post,
            action: LogAction.deleted,
            target: 'New version comes out with logs working',
          }),
        );
      }, 500);
    });

    const response = await supertest(app.getHttpServer())
      .get(`/log/list`)
      .set({ Authorization: `Bearer ${token}` })
      .query({
        page: 1,
        amount: 1,
        targetType: LogTargetType.post,
      })
      .expect(200);

    expect(response.body.totalCount).toBe(2);
    expect(response.body.logs.length).toBe(1);
    expect(response.body.logs[0]).toMatchObject({
      id: log.id.toValue(),
      action: log.action,
      author: expect.objectContaining({
        name: user.name,
        email: user.email,
        role: user.role,
      }),
      target: log.target,
      targetType: log.targetType,
      createdAt: log.createdAt.toISOString(),
    });
  });
});
