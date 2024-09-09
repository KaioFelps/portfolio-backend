import { AppModule } from '@/app.module';
import { DatabaseModule } from '@/infra/db/database.module';
import { PrismaService } from '@/infra/db/prisma/prisma-service';
import { INestApplication } from '@nestjs/common';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { Test, TestingModule } from '@nestjs/testing';
import supertest from 'supertest';
import { ProjectFactory } from 'test/factories/project-factory';
import { TagFactory } from 'test/factories/tag-factory';
import { UserFactory } from 'test/factories/user-factory';
import { ProjectPresented } from '../presenters/project-presenter';
import { PrismaProjectTagMapper } from '@/infra/db/prisma/mappers/prisma-project-tag-mapper';
import { ProjectTagFactory } from 'test/factories/project-tag-factory';
import { EntityUniqueId } from '@/core/entities/entity-unique-id';
import { PrismaProjectMapper } from '@/infra/db/prisma/mappers/prisma-project-mapper';
import { DomainEvents } from '@/core/events/domain-events';

describe('ProjectController', () => {
  let app: INestApplication;
  let userFactory: UserFactory;
  let tagsFactory: TagFactory;
  let projectFactory: ProjectFactory;
  let jwt: JwtService;
  let prisma: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [UserFactory, ProjectFactory, TagFactory, JwtModule],
    }).compile();

    app = module.createNestApplication();
    userFactory = module.get(UserFactory);
    tagsFactory = module.get(TagFactory);
    projectFactory = module.get(ProjectFactory);
    jwt = module.get(JwtService);
    prisma = module.get(PrismaService);

    await app.init();
  });

  afterEach(() => {
    DomainEvents.AggregateEvent['clearEveryAggregateEvent!']();
  });

  test('[GET] /project/list', async () => {
    const tag = await tagsFactory.createAndPersist({ value: 'Téres' });

    const projectId = new EntityUniqueId();

    const generators: Array<Promise<any>> = [];
    for (let i = 0; i <= 14; i++) {
      switch (i) {
        case 2:
          generators.push(projectFactory.createAndPersist({}, projectId));
          break;
        default:
          generators.push(projectFactory.createAndPersist());
          break;
      }
    }

    await Promise.all(generators);
    await prisma.tagsOnPostsOrProjects.create({
      data: {
        projectId: projectId.toValue(),
        tagId: tag.id.toValue(),
      },
    });

    // expect it to accept lower case searches
    const response = await supertest(app.getHttpServer())
      .get('/project/list?&amount=12&tag=téres')
      .send()
      .expect(200);

    expect(response.body).toMatchObject({
      projects: expect.any(Array),
      totalCount: 1,
      page: 1,
      perPage: 12,
    });

    expect(response.body.projects.length).toBe(1);

    // should not break on searched an unexisting tag
    const responseWithUnexistingTag = await supertest(app.getHttpServer())
      .get('/project/list?tag=tér')
      .send()
      .expect(200);

    expect(responseWithUnexistingTag.body.projects.length).toBe(0);
    expect(responseWithUnexistingTag.body.totalCount).toBe(0);
  });

  test('[GET] /project/:id', async () => {
    const project = await projectFactory.createAndPersist();

    const user = await userFactory.createAndPersist('editor');
    const token = await jwt.signAsync({
      name: user.name,
      role: user.role,
      sub: user.id.toValue(),
    });

    const response = await supertest(app.getHttpServer())
      .get('/project/' + project.id.toValue())
      .set({ Authorization: `Bearer ${token}` })
      .send()
      .expect(200);

    expect(response.body.project).toMatchObject({
      createdAt: expect.any(String),
      id: project.id.toValue(),
      links: [],
      tags: [],
      title: project.title,
      topstory: project.topstory,
    } as ProjectPresented);
  });

  test('[POST] /project/new', async () => {
    const user = await userFactory.createAndPersist('admin');
    const token = await jwt.signAsync({
      name: user.name,
      role: user.role,
      sub: user.id.toValue(),
    });

    const tag = await tagsFactory.createAndPersist({ value: 'front end' });

    const result = await supertest(app.getHttpServer())
      .post('/project/new')
      .set({ Authorization: `Bearer ${token}` })
      .send({
        title: 'Hidro Mourão',
        topstory: 'https://i.imgur.com/payZTW9.png',
        tags: [tag.id.toValue()],
        links: [{ title: 'Deploy', value: 'https://hidromourao.com' }],
      })
      .expect(201);

    expect(result.body.project).toMatchObject({
      id: expect.any(String),
      title: 'Hidro Mourão',
      tags: expect.arrayContaining([
        expect.objectContaining({
          value: 'front end',
          id: tag.id.toValue(),
        }),
      ]),
      links: expect.arrayContaining([
        expect.objectContaining({
          title: 'Deploy',
          value: 'https://hidromourao.com',
        }),
      ]),
      topstory: expect.any(String),
      createdAt: expect.any(String),
    });
  });

  test('[PUT] /project/:id/edit', async () => {
    const user = await userFactory.createAndPersist('admin');
    const token = await jwt.signAsync({
      name: user.name,
      role: user.role,
      sub: user.id.toValue(),
    });

    const tag = await tagsFactory.createAndPersist({ value: 'front end' });
    const tag2 = await tagsFactory.createAndPersist({ value: 'remover' });

    const projectId = new EntityUniqueId();
    const projectTag = ProjectTagFactory.exec({ projectId, tag });
    const projectTag2 = ProjectTagFactory.exec({ projectId, tag: tag2 });

    const project = ProjectFactory.exec({}, projectId);
    await prisma.project.create({
      data: PrismaProjectMapper.toPrisma(project),
    });

    await prisma.tagsOnPostsOrProjects.createMany(
      PrismaProjectTagMapper.toPrismaCreateMany([projectTag, projectTag2]),
    );

    const response = await supertest(app.getHttpServer())
      .put(`/project/${project.id.toValue()}/edit`)
      .set({ Authorization: `Bearer ${token}` })
      .send({
        title: 'Edited title of the project',
        tags: [tag.id.toValue()],
      })
      .expect(200);

    const projectOnDb = await prisma.project.findUnique({
      where: { id: project.id.toValue() },
      include: { tags: true },
    });

    expect(projectOnDb!.title).toEqual('Edited title of the project');
    expect(projectOnDb!.tags[0].tagId).toEqual(tag.id.toValue());
    expect(projectOnDb!.tags.length).toBe(1);
    expect(response.body.project.tags).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ value: 'front end', id: tag.id.toValue() }),
      ]),
    );
  });

  test('[DELETE] /project/:id/delete', async () => {
    const user = await userFactory.createAndPersist('admin');
    const token = await jwt.signAsync({
      name: user.name,
      role: user.role,
      sub: user.id.toValue(),
    });

    const project = await projectFactory.createAndPersist();

    await supertest(app.getHttpServer())
      .delete(`/project/${project.id.toValue()}/delete`)
      .set({ Authorization: `Bearer ${token}` })
      .send()
      .expect(204);

    const projectOnDb = await prisma.project.findMany();

    expect(projectOnDb.length).toBe(0);
  });
});
