import { AppModule } from '@/app.module';
import { QUANTITY_PER_PAGE } from '@/core/pagination-consts';
import { DatabaseModule } from '@/infra/db/database.module';
import { PrismaService } from '@/infra/db/prisma/prisma-service';
import { INestApplication } from '@nestjs/common';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { Test, TestingModule } from '@nestjs/testing';
import supertest from 'supertest';
import { PostFactory } from 'test/factories/post-factory';
import { UserFactory } from 'test/factories/user-factory';

describe('PostController', () => {
  let app: INestApplication;
  let userFactory: UserFactory;
  let postFactory: PostFactory;
  let _jwt: JwtService;
  let _prisma: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [UserFactory, PostFactory, JwtModule],
    }).compile();

    app = module.createNestApplication();
    userFactory = module.get(UserFactory);
    postFactory = module.get(PostFactory);
    _jwt = module.get(JwtService);
    _prisma = module.get(PrismaService);

    await app.init();
  });

  test('[GET] /post/:slug/show', async () => {
    const user = await userFactory.createAndPersist('editor');
    const post = await postFactory.createAndPersist({
      authorId: user.id,
    });

    const response = await supertest(app.getHttpServer()).get(
      `/post/${post.slug}/show`,
    );

    expect(response.body.post).toEqual(
      expect.objectContaining({
        id: post.id.toValue(),
        author: user.name,
        content: post.content,
        createdAt: expect.any(String),
        title: post.title,
        slug: post.slug,
        topstory: post.topstory,
        tags: post.tags,
        updatedAt: null,
      }),
    );
  });

  test('[GET] /post/list', async () => {
    const user = await userFactory.createAndPersist('editor');

    for (let i = 0; i <= 5; i++) {
      switch (i) {
        case 2:
        case 3:
          await postFactory.createAndPersist({
            authorId: user.id,
            title: `must be catched ${i}`.toString(),
          });
          break;
        default:
          await postFactory.createAndPersist({
            authorId: user.id,
          });
      }
    }

    const response = await supertest(app.getHttpServer())
      .get('/post/list')
      .query({ query: 'must be catched' })
      .send()
      .expect(200);

    expect(response.body).toEqual({
      posts: expect.any(Array),
      totalCount: 2,
      page: 1,
      perPage: QUANTITY_PER_PAGE,
    });
    expect(response.body.posts.length).toBe(2);
  });

  test.skip('[POST] /post/new', async () => {});

  test.skip('[PUT] /post/:id/edit', async () => {});

  test.skip('[DELETE] /post/:id/delete', async () => {});
});
