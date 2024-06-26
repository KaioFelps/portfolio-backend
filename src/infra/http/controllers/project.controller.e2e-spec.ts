import { AppModule } from '@/app.module';
import { QUANTITY_PER_PAGE } from '@/core/pagination-consts';
import { DatabaseModule } from '@/infra/db/database.module';
import { PrismaService } from '@/infra/db/prisma/prisma-service';
import { INestApplication } from '@nestjs/common';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { Test, TestingModule } from '@nestjs/testing';
import supertest from 'supertest';
import { ProjectFactory } from 'test/factories/project-factory';
import { UserFactory } from 'test/factories/user-factory';

describe('ProjectController', () => {
  let app: INestApplication;
  let userFactory: UserFactory;
  let projectFactory: ProjectFactory;
  let jwt: JwtService;
  let prisma: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [UserFactory, ProjectFactory, JwtModule],
    }).compile();

    app = module.createNestApplication();
    userFactory = module.get(UserFactory);
    projectFactory = module.get(ProjectFactory);
    jwt = module.get(JwtService);
    prisma = module.get(PrismaService);

    await app.init();
  });

  test('[GET] /project/list', async () => {
    for (let i = 0; i <= 14; i++) {
      await projectFactory.createAndPersist();
    }

    const response = await supertest(app.getHttpServer())
      .get('/project/list?page=2')
      .send()
      .expect(200);

    expect(response.body).toMatchObject({
      projects: expect.any(Array),
      totalCount: 15,
      page: 2,
      perPage: QUANTITY_PER_PAGE,
    });

    expect(response.body.projects.length).toBe(3);
  });

  test('[POST] /project/new', async () => {
    const user = await userFactory.createAndPersist('admin');
    const token = await jwt.signAsync({
      name: user.name,
      role: user.role,
      sub: user.id.toValue(),
    });

    const result = await supertest(app.getHttpServer())
      .post('/project/new')
      .set({ Authorization: `Bearer ${token}` })
      .send({
        title: 'Hidro Mourão',
        topstory: 'https://i.imgur.com/payZTW9.png',
        tags: ['front-end'],
        links: ['https://hidromourao.com'],
      })
      .expect(201);

    expect(result.body.project).toMatchObject({
      id: expect.any(String),
      title: 'Hidro Mourão',
      tags: expect.arrayContaining([
        expect.objectContaining({
          value: 'front-end',
        }),
      ]),
      links: expect.arrayContaining([
        expect.objectContaining({
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

    const project = await projectFactory.createAndPersist();

    await supertest(app.getHttpServer())
      .put(`/project/${project.id.toValue()}/edit`)
      .set({ Authorization: `Bearer ${token}` })
      .send({
        title: 'Edited title of the project',
        tags: ['front-end'],
      })
      .expect(204);

    const projectOnDb = await prisma.project.findUnique({
      where: { id: project.id.toValue() },
      include: { tags: true },
    });

    expect(projectOnDb!.title).toEqual('Edited title of the project');
    expect(projectOnDb!.tags).toEqual(
      expect.arrayContaining([expect.objectContaining({ value: 'front-end' })]),
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
