import { AppModule } from '@/app.module';
import { EntityUniqueId } from '@/core/entities/entity-unique-id';
import { QUANTITY_PER_PAGE } from '@/core/pagination-consts';
import { PostTag } from '@/domain/posts/entities/post-tag';
import { PostTagList } from '@/domain/posts/entities/post-tag-list';
import { TokenPayload } from '@/infra/auth/jwt-strategy';
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
  let jwt: JwtService;
  let prisma: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [UserFactory, PostFactory, JwtModule],
    }).compile();

    app = module.createNestApplication();
    userFactory = module.get(UserFactory);
    postFactory = module.get(PostFactory);
    jwt = module.get(JwtService);
    prisma = module.get(PrismaService);

    await app.init();
  });

  test('[POST] /post/new', async () => {
    const user = await userFactory.createAndPersist('admin');

    const payload: TokenPayload = {
      name: user.name,
      role: user.role,
      sub: user.id.toValue(),
    };
    const token = await jwt.signAsync(payload);

    const response = await supertest(app.getHttpServer())
      .post('/post/new')
      .set({ Authorization: `Bearer ${token}` })
      .send({
        title: 'Noticia 1',
        content: 'conteúdo',
        topstory: 'https://i.imgur.com/Q0GsNvP.png',
        tags: ['habbo'],
      })
      .expect(201);

    const postOnDatabase = await prisma.post.findUnique({
      where: { slug: response.body.post.slug },
    });

    expect(postOnDatabase?.slug).toEqual(response.body.post.slug);
    expect(response.body.post.title).toEqual('Noticia 1');
  });

  test('[GET] /post/:slug/show', async () => {
    const user = await userFactory.createAndPersist('editor');

    const post = await postFactory.createAndPersist({
      authorId: user.id,
      publishedAt: new Date(),
    });

    const nonPublishedPost = await postFactory.createAndPersist({
      authorId: user.id,
    });

    const response = await supertest(app.getHttpServer()).get(
      `/post/${post.slug}/show`,
    );

    expect(
      response.statusCode,
      "unlogged '/post/:slug/show' request to return a '200' http status code.",
    ).toBe(200);

    const token = await jwt.signAsync({
      name: user.name,
      role: user.role,
      sub: user.id.toValue(),
    } satisfies TokenPayload);

    const loggedInResponse = await supertest(app.getHttpServer())
      .get(`/post/${nonPublishedPost.slug}/show`)
      .set({ Authorization: `Bearer ${token}` })
      .send();

    expect(
      loggedInResponse.statusCode,
      "logged in '/post/:slug/show' request to return a '200' http status code.",
    ).toBe(200);

    expect(
      response.body.post,
      'to be able to see a published post even unlogged in.',
    ).toEqual(
      expect.objectContaining({
        id: post.id.toValue(),
        author: user.name,
        content: post.content,
        createdAt: expect.any(String),
        title: post.title,
        slug: post.slug,
        topstory: post.topstory,
        tags: [],
        updatedAt: null,
        publishedAt: expect.any(String),
      }),
    );

    expect(
      loggedInResponse.body.post,
      'to be able to see a unpublished post, once logged in.',
    ).toEqual(
      expect.objectContaining({
        id: nonPublishedPost.id.toValue(),
        author: user.name,
        content: nonPublishedPost.content,
        createdAt: expect.any(String),
        title: nonPublishedPost.title,
        slug: nonPublishedPost.slug,
        topstory: nonPublishedPost.topstory,
        tags: [],
        updatedAt: null,
        publishedAt: null,
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
        publishedAt: new Date(),
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

    for (let i = 0; i <= 3; i++) {
      switch (i) {
        case 2:
        case 3:
          await postFactory.createAndPersist({
            authorId: user.id,
            title: `must be catched ${query} ${i}`.toString(),
            publishedAt: new Date(),
          });
          break;
        default:
          // this one is not going to be catched on the queryByTitle request
          // because it has not been published
          await postFactory.createAndPersist({
            authorId: user.id,
            title: `must be catched ${query} ${i}`.toString(),
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

  test('[GET] /post/list/admin', async () => {
    const user = await userFactory.createAndPersist('editor');

    const token = await jwt.signAsync({
      name: user.name,
      role: user.role,
      sub: user.id.toValue(),
    } as TokenPayload);

    for (let i = 0; i <= 2; i++) {
      switch (i) {
        case 0:
        case 2:
          await postFactory.createAndPersist({
            publishedAt: new Date(),
            authorId: user.id,
          });
          break;
        default:
          await postFactory.createAndPersist({ authorId: user.id });
      }
    }

    const response = await supertest(app.getHttpServer())
      .get('/post/list/admin')
      .set({ Authorization: `Bearer ${token}` })
      .send()
      .expect(200);

    expect(response.body.posts).toHaveLength(3);
    expect(response.body.totalCount).toBe(3);
  });

  test('[PUT] /post/:id/edit', async () => {
    const user = await userFactory.createAndPersist('editor');

    const post = await postFactory.createAndPersist({
      authorId: user.id,
    });

    const tags = [
      PostTag.create({ value: 'habbo', postId: post.id }),
      PostTag.create({ value: 'noticia', postId: post.id }),
      PostTag.create({ value: 'artigo', postId: post.id }),
    ];

    await prisma.tag.createMany({
      data: tags.map(({ id, postId, value }) => ({
        id: id.toValue(),
        postId: postId.toValue(),
        value,
      })),
    });

    const token = await jwt.signAsync({
      name: user.name,
      role: user.role,
      sub: user.id.toValue(),
    } as TokenPayload);

    const response = await supertest(app.getHttpServer())
      .put(`/post/${post.id.toValue()}/edit`)
      .set({
        Authorization: `Bearer ${token}`,
      })
      .send({
        title: 'Edited title',
        tags: ['free fire', 'artigo'],
        // not any field are mandatory at all
      })
      .expect(200);

    expect(response.body.post.title).not.toEqual(post.title);

    const postOnDb = await prisma.post.findUnique({
      where: { id: post.id.toValue() },
      include: { tags: true },
    });

    expect(postOnDb?.title).toEqual(response.body.post.title);

    expect(postOnDb?.tags.map((tag) => tag.value)).toEqual(
      expect.arrayContaining(['free fire', 'artigo']),
    );
  });

  test('[DELETE] /post/:id/delete', async () => {
    const user = await userFactory.createAndPersist('admin');

    const token = await jwt.signAsync({
      name: user.name,
      role: user.role,
      sub: user.id.toValue(),
    } as TokenPayload);

    const post = await postFactory.createAndPersist({
      authorId: user.id,
    });

    await supertest(app.getHttpServer())
      .delete(`/post/${post.id.toValue()}/delete`)
      .set({ Authorization: `Bearer ${token}` })
      .send()
      .expect(200);

    const postOnDatabase = await prisma.post.findFirst({
      where: { id: post.id.toValue() },
    });

    expect(postOnDatabase).toBeNull();
  });

  test('[PATCH] /post/:id/visibility', async () => {
    const user = await userFactory.createAndPersist('editor');

    const post = await postFactory.createAndPersist({
      authorId: user.id,
    });

    expect(post.publishedAt).toBeNull();

    const token = await jwt.signAsync({
      name: user.name,
      role: user.role,
      sub: user.id.toValue(),
    } as TokenPayload);

    await supertest(app.getHttpServer())
      .patch(`/post/${post.id.toValue()}/visibility`)
      .set({
        Authorization: `Bearer ${token}`,
      })
      .expect(204);

    const postOnDb = await prisma.post.findUnique({
      where: { id: post.id.toValue() },
    });

    expect(postOnDb?.publishedAt).toEqual(expect.any(Date));
  });
});
