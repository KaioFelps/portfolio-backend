import { Test } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { AppModule } from '@/app.module';
import { DatabaseModule } from '../db/database.module';
import supertest from 'supertest';
import { UserFactory } from 'test/factories/user-factory';
import { TokenPayload } from '../auth/jwt-strategy';
import { JwtService } from '@nestjs/jwt';
import { CreateTagDto } from '../http/dtos/create-tag';
import { PrismaService } from '../db/prisma/prisma-service';
import { waitFor } from 'test/utlils/wait-for';
import { TagFactory } from 'test/factories/tag-factory';

describe('On Tag Created Event handler', () => {
  let app: INestApplication;
  let jwt: JwtService;
  let prisma: PrismaService;
  let userFactory: UserFactory;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [UserFactory, TagFactory],
    }).compile();

    app = module.createNestApplication();
    jwt = module.get(JwtService);
    prisma = module.get(PrismaService);
    userFactory = module.get(UserFactory);

    await app.init();
  });

  it('should register a new log when a tag is created', async () => {
    const user = await userFactory.createAndPersist('editor');

    const token = await jwt.signAsync({
      name: user.name,
      role: user.role,
      sub: user.id.toValue(),
    } as TokenPayload);

    const response = await supertest(app.getHttpServer())
      .post('/tag/new')
      .set({ Authorization: `Bearer ${token}` })
      .send({
        value: 'Rust',
      } as CreateTagDto)
      .expect(201);

    await waitFor(async () => {
      const logsOnDb = await prisma.log.findMany();

      expect(logsOnDb.length).toBe(1);
    });

    expect(response.ok).toBe(true);
  });
});
