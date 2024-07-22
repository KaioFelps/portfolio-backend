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
import { PostFactory } from 'test/factories/post-factory';
import { TagFactory } from 'test/factories/tag-factory';

describe('On Post Edited Event handler', () => {
  let app: INestApplication;
  let jwt: JwtService;
  let prisma: PrismaService;
  let userFactory: UserFactory;
  let postFactory: PostFactory;
  let tagFactory: TagFactory;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [UserFactory, PostFactory, TagFactory],
    }).compile();

    app = module.createNestApplication();
    jwt = module.get(JwtService);
    prisma = module.get(PrismaService);
    userFactory = module.get(UserFactory);
    postFactory = module.get(PostFactory);
    tagFactory = module.get(TagFactory);
    await app.init();
  });

  it('should register a new log when a post is edited', async () => {
    const user = await userFactory.createAndPersist('admin');
    const post = await postFactory.createAndPersist({ authorId: user.id });

    const token = await jwt.signAsync({
      name: user.name,
      role: user.role,
      sub: user.id.toValue(),
    } as TokenPayload);

    const newPostTitle = 'Título editadooo!!';

    const tagEventos = await tagFactory.createAndPersist({ value: 'eventos' });

    const response = await supertest(app.getHttpServer())
      .put(`/post/${post.id.toValue()}/edit`)
      .set({ Authorization: `Bearer ${token}` })
      .send({
        tags: [tagEventos.id.toValue()],
        title: newPostTitle,
      } as CreatePostDto);

    await waitFor(async () => {
      const logsOnDb = await prisma.log.findMany();

      expect(logsOnDb.length).toBe(1);
    }, 10000);

    expect(response.ok).toBe(true);
  });
});
