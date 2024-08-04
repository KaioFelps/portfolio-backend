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
import { UpdateUserDto } from '../http/dtos/update-user';
import { LogAction, LogTargetType } from '@prisma/client';

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

  it('should register a new log when a user is edited', async () => {
    const adminUser = await userFactory.createAndPersist('admin');
    const user = await userFactory.createAndPersist('editor');

    const token = await jwt.signAsync({
      name: adminUser.name,
      role: adminUser.role,
      sub: adminUser.id.toValue(),
    } as TokenPayload);

    const newUserName = 'Edited Name';

    const response = await supertest(app.getHttpServer())
      .put(`/user/${user.id.toValue()}/edit`)
      .set({ Authorization: `Bearer ${token}` })
      .send({
        name: newUserName,
      } as UpdateUserDto)
      .expect(204);

    await waitFor(async () => {
      const logsOnDb = await prisma.log.findMany({
        where: {
          action: LogAction.UPDATED,
          targetType: LogTargetType.USER,
          target: newUserName,
        },
      });

      expect(logsOnDb.length).toBe(1);
    });

    expect(response.ok).toBe(true);
  });
});
