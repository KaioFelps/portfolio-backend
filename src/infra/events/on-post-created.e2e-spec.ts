import { Test } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { AppModule } from '@/app.module';
import { DatabaseModule } from '../db/database.module';
import supertest from 'supertest';
import { UserFactory } from 'test/factories/user-factory';
import { TokenPayload } from '../auth/jwt-strategy';
import { JwtService } from '@nestjs/jwt';
import { CreatePostDto } from '../http/dtos/create-post';
import { PrismaService } from '../db/prisma/prisma-service';
import { waitFor } from 'test/utlils/wait-for';

describe('On Post Created Event handler', () => {
  let app: INestApplication;
  let jwt: JwtService;
  let prisma: PrismaService;
  let userFactory: UserFactory;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [UserFactory],
    }).compile();

    app = module.createNestApplication();
    jwt = module.get(JwtService);
    prisma = module.get(PrismaService);
    userFactory = module.get(UserFactory);

    await app.init();
  });

  it('should register a new log when a post is created', async () => {
    const user = await userFactory.createAndPersist('admin');

    const token = await jwt.signAsync({
      name: user.name,
      role: user.role,
      sub: user.id.toValue(),
    } as TokenPayload);

    const postTitle = 'Testando o evento de criação de post!';

    const _response = await supertest(app.getHttpServer())
      .post('/post/new')
      .set({ Authorization: `Bearer ${token}` })
      .send({
        content: 'Conteúdo do meu primeiro post fictício!',
        tags: ['eventos', 'domínio'],
        title: postTitle,
        topstory: 'https://i.imgur.com/NQ9ImcM.png',
        authorId: user.id.toValue(),
      } as CreatePostDto);

    await waitFor(async () => {
      const logsOnDb = await prisma.log.findMany();

      expect(logsOnDb.length).toBe(1);
    }, 10000);
  });
});
