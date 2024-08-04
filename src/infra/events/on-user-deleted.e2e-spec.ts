import { Test } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { AppModule } from '@/app.module';
import { DatabaseModule } from '../db/database.module';
import supertest from 'supertest';
import { UserFactory } from 'test/factories/user-factory';
import { TokenPayload } from '../auth/jwt-strategy';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../db/prisma/prisma-service';
import { waitFor } from 'test/utlils/wait-for';
import { LogAction } from '@/domain/logs/entities/log';

describe('On User Edited Event handler', () => {
  let app: INestApplication;
  let jwt: JwtService;
  let prisma: PrismaService;
  let userFactory: UserFactory;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [UserFactory, UserFactory],
    }).compile();

    app = module.createNestApplication();
    jwt = module.get(JwtService);
    prisma = module.get(PrismaService);
    userFactory = module.get(UserFactory);
    userFactory = module.get(UserFactory);
    await app.init();
  });

  it('should register a new log when a user is deleted', async () => {
    const adminUser = await userFactory.createAndPersist('admin');
    const user = await userFactory.createAndPersist('editor');

    const token = await jwt.signAsync({
      name: adminUser.name,
      role: adminUser.role,
      sub: adminUser.id.toValue(),
    } as TokenPayload);

    const response = await supertest(app.getHttpServer())
      .delete(`/user/${user.id.toValue()}/delete`)
      .set({ Authorization: `Bearer ${token}` })
      .send()
      .expect(204);

    await waitFor(async () => {
      const logsOnDb = await prisma.log.findMany({
        where: { action: LogAction.deleted, target: user.name },
      });

      expect(logsOnDb.length).toBe(1);
    });

    expect(response.ok).toBe(true);
  });
});
