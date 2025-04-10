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
import { TagFactory } from 'test/factories/tag-factory';
import { LogAction, LogTargetType } from '@/domain/logs/entities/log';

describe('On Post Created Event handler', () => {
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

  it('should register a new log when a post is created', async () => {
    const user = await userFactory.createAndPersist('admin');

    const token = await jwt.signAsync({
      name: user.name,
      role: user.role,
      sub: user.id.toValue(),
    } as TokenPayload);

    const postTitle = 'Testando o evento de criação de post!';

    const tagEventos = await tagFactory.createAndPersist({ value: 'eventos' });
    const tagDominios = await tagFactory.createAndPersist({ value: 'domínio' });

    const response = await supertest(app.getHttpServer())
      .post('/post/new')
      .set({ Authorization: `Bearer ${token}` })
      .send({
        description: 'Descrição do post fictício.',
        content: 'Conteúdo do meu primeiro post fictício!',
        tags: [tagEventos.id.toValue(), tagDominios.id.toValue()],
        title: postTitle,
        topstory: 'https://i.imgur.com/NQ9ImcM.png',
        authorId: user.id.toValue(),
      } as CreatePostDto)
      .expect(201);

    await waitFor(async () => {
      const logsOnDb = await prisma.log.findMany({
        where: {
          action: LogAction.created,
          targetType: LogTargetType.post,
        },
      });

      expect(logsOnDb.length).toBe(1);
    });

    expect(response.ok).toBe(true);
  });
});
