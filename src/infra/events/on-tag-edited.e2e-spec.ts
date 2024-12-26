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
import { TagFactory } from 'test/factories/tag-factory';
import { LogAction, LogTargetType } from '@prisma/client';
import { UpdateTagDto } from '../http/dtos/update-tag';

describe('On Tag Edited Event handler', () => {
  let app: INestApplication;
  let jwt: JwtService;
  let prisma: PrismaService;
  let userFactory: UserFactory;
  let tagFactory: TagFactory;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [UserFactory, TagFactory],
    }).compile();

    app = module.createNestApplication();
    jwt = module.get(JwtService);
    prisma = module.get(PrismaService);
    userFactory = module.get(UserFactory);
    tagFactory = module.get(TagFactory);
    await app.init();
  });

  it('should register a new log when a tag is edited', async () => {
    const user = await userFactory.createAndPersist('admin');
    const tag = await tagFactory.createAndPersist();

    const token = await jwt.signAsync({
      name: user.name,
      role: user.role,
      sub: user.id.toValue(),
    } as TokenPayload);

    const newTagValue = 'Tereré';

    const response = await supertest(app.getHttpServer())
      .patch(`/tag/${tag.id.toValue()}/edit`)
      .set({ Authorization: `Bearer ${token}` })
      .send({
        value: newTagValue,
      } as UpdateTagDto)
      .expect(200);

    await waitFor(async () => {
      const logsOnDb = await prisma.log.findMany({
        where: {
          action: LogAction.UPDATED,
          targetType: LogTargetType.TAG,
          target: newTagValue,
        },
      });

      expect(logsOnDb.length).toBe(1);
    });

    expect(response.ok).toBe(true);
  });
});