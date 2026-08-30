
import { INestApplication } from '@nestjs/common';


import supertest from 'supertest';
import { UserFactory } from 'test/factories/user-factory';
import { TokenPayload } from '../auth/jwt-strategy';
import { JwtService } from '@nestjs/jwt';
import { CreateProjectDto } from '../http/dtos/create-project';
import { PrismaService } from '../db/prisma/prisma-service';
import { waitFor } from 'test/utlils/wait-for';
import { ProjectFactory } from 'test/factories/project-factory';
import { LogAction, LogTargetType } from 'prisma/generated/client';
import { provisionTestApp } from 'test/get-testing-app';

describe('On Project Edited Event handler', () => {
  let app: INestApplication;
  let jwt: JwtService;
  let prisma: PrismaService;
  let userFactory: UserFactory;
  let projectFactory: ProjectFactory;

  beforeEach(async () => {
    

    app = await provisionTestApp();
    jwt = app.get(JwtService);
    prisma = app.get(PrismaService);
    userFactory = app.get(UserFactory);
    projectFactory = app.get(ProjectFactory);
    await app.init();
  });

  it('should register a new log when a project is edited', async () => {
    const user = await userFactory.createAndPersist('admin');
    const project = await projectFactory.createAndPersist();

    const token = await jwt.signAsync({
      name: user.name,
      role: user.role,
      sub: user.id.toValue(),
    } as TokenPayload);

    const newProjectTitle = 'Título editadooo!!';

    const response = await supertest(app.getHttpServer())
      .put(`/project/${project.id.toValue()}/edit`)
      .set({ Authorization: `Bearer ${token}` })
      .send({
        title: newProjectTitle,
      } as CreateProjectDto)
      .expect(200);

    await waitFor(async () => {
      const logsOnDb = await prisma.log.findMany({
        where: {
          action: LogAction.UPDATED,
          targetType: LogTargetType.PROJECT,
          target: newProjectTitle,
        },
      });

      expect(logsOnDb.length).toBe(1);
    });

    expect(response.ok).toBe(true);
  });
});
