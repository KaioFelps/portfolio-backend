import { AppModule } from '@/app.module';
import { EntityUniqueId } from '@/core/entities/entity-unique-id';
import { QUANTITY_PER_PAGE } from '@/core/pagination-consts';
import { PostTagList } from '@/domain/posts/entities/post-tag-list';
import { DatabaseModule } from '@/infra/db/database.module';
import { PrismaService } from '@/infra/db/prisma/prisma-service';
import { INestApplication } from '@nestjs/common';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { Test, TestingModule } from '@nestjs/testing';
import { randomUUID } from 'crypto';
import supertest from 'supertest';
import { PostFactory } from 'test/factories/post-factory';
import { PostTagFactory } from 'test/factories/post-tag-factory';
import { UserFactory } from 'test/factories/user-factory';

describe('PostController', () => {
  let app: INestApplication;
  let userFactory: UserFactory;
  let postFactory: PostFactory;
  let _jwt: JwtService;
  let prisma: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [UserFactory, PostFactory, JwtModule],
    }).compile();

    app = module.createNestApplication();
    userFactory = module.get(UserFactory);
    postFactory = module.get(PostFactory);
    _jwt = module.get(JwtService);
    prisma = module.get(PrismaService);

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
    const query = 'slay';

    const user = await userFactory.createAndPersist('editor');
    const postId = new EntityUniqueId(randomUUID());
    const tag = PostTagFactory.exec({
      value: 'catch-tag',
      postId,
    });

    await postFactory.createAndPersist(
      {
        authorId: user.id,
        tags: new PostTagList([tag]),
      },
      postId,
    );

    await prisma.tag.create({
      data: {
        value: tag.value,
        id: tag.id.toValue(),
        postId: tag.postId.toValue(),
      },
    });

    for (let i = 0; i <= 5; i++) {
      switch (i) {
        case 2:
        case 3:
          await postFactory.createAndPersist({
            authorId: user.id,
            title: `must be catched ${query} ${i}`.toString(),
          });
          break;
        default:
          await postFactory.createAndPersist({
            authorId: user.id,
          });
      }
    }

    const queryByTitleResponse = await supertest(app.getHttpServer())
      .get('/post/list')
      .query({ query })
      .send()
      .expect(200);

    expect(queryByTitleResponse.body).toEqual({
      posts: expect.any(Array),
      totalCount: 2,
      page: 1,
      perPage: QUANTITY_PER_PAGE,
    });
    expect(queryByTitleResponse.body.posts.length).toBe(2);

    const queryByTagResponse = await supertest(app.getHttpServer())
      .get('/post/list')
      .query({ tag: 'catch-tag' })
      .send()
      .expect(200);

    expect(queryByTagResponse.body).toEqual({
      posts: expect.any(Array),
      totalCount: 1,
      page: 1,
      perPage: QUANTITY_PER_PAGE,
    });
  });

  test.skip('[POST] /post/new', async () => {});

  test.skip('[PUT] /post/:id/edit', async () => {});

  test.skip('[DELETE] /post/:id/delete', async () => {});
});
