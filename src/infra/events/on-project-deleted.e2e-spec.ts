import { Test } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { AppModule } from '@/app.module';
import { DatabaseModule } from '../db/database.module';
import supertest from 'supertest';
import { UserFactory } from 'test/factories/user-factory';
import { TokenPayload } from '../auth/jwt-strategy';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../db/prisma/prisma-service';
import { waitFor } from 'test/utlils/wait-for';
import { ProjectFactory } from 'test/factories/project-factory';
import { LogAction } from '@/domain/logs/entities/log';

describe('On Project Edited Event handler', () => {
  let app: INestApplication;
  let jwt: JwtService;
  let prisma: PrismaService;
  let userFactory: UserFactory;
  let projectFactory: ProjectFactory;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [UserFactory, ProjectFactory],
    }).compile();

    app = module.createNestApplication();
    jwt = module.get(JwtService);
    prisma = module.get(PrismaService);
    userFactory = module.get(UserFactory);
    projectFactory = module.get(ProjectFactory);
    await app.init();
  });

  it('should register a new log when a project is deleted', async () => {
    const user = await userFactory.createAndPersist('admin');
    const project = await projectFactory.createAndPersist();

    const token = await jwt.signAsync({
      name: user.name,
      role: user.role,
      sub: user.id.toValue(),
    } as TokenPayload);

    const response = await supertest(app.getHttpServer())
      .delete(`/project/${project.id.toValue()}/delete`)
      .set({ Authorization: `Bearer ${token}` })
      .send()
      .expect(204);

    await waitFor(async () => {
      const logsOnDb = await prisma.log.findMany({
        where: { action: LogAction.deleted, target: project.title },
      });

      expect(logsOnDb.length).toBe(1);
    }, 10000);

    expect(response.ok).toBe(true);
  });
});
