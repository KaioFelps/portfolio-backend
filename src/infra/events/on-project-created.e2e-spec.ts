import { Test } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { AppModule } from '@/app.module';
import { DatabaseModule } from '../db/database.module';
import supertest from 'supertest';
import { UserFactory } from 'test/factories/user-factory';
import { TokenPayload } from '../auth/jwt-strategy';
import { JwtService } from '@nestjs/jwt';
import { CreateProjectDto } from '../http/dtos/create-project';
import { PrismaService } from '../db/prisma/prisma-service';
import { waitFor } from 'test/utlils/wait-for';
import { TagFactory } from 'test/factories/tag-factory';

describe('On Project Created Event handler', () => {
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

  it('should register a new log when a project is created', async () => {
    const user = await userFactory.createAndPersist('admin');

    const token = await jwt.signAsync({
      name: user.name,
      role: user.role,
      sub: user.id.toValue(),
    } as TokenPayload);

    const tag = await tagFactory.createAndPersist({
      value: 'front end',
    });

    const response = await supertest(app.getHttpServer())
      .post('/project/new')
      .set({ Authorization: `Bearer ${token}` })
      .send({
        title: 'Portfólio',
        topstory: 'https://i.imgur.com/NQ9ImcM.png',
        tags: [tag.id.toValue()],
        links: [{ title: 'Deploy', value: 'https://www.kaiofelps.dev' }],
      } as CreateProjectDto)
      .expect(201);

    await waitFor(async () => {
      const logsOnDb = await prisma.log.findMany();

      expect(logsOnDb.length).toBe(1);
    });

    expect(response.ok).toBe(true);
  });
});
