import { Test } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { AppModule } from '@/app.module';
import { DatabaseModule } from '../db/database.module';
import supertest from 'supertest';
import { UserFactory } from 'test/factories/user-factory';
import { TokenPayload } from '../auth/jwt-strategy';
import { JwtService } from '@nestjs/jwt';
import { CreateUserDto } from '../http/dtos/create-user';
import { PrismaService } from '../db/prisma/prisma-service';
import { waitFor } from 'test/utlils/wait-for';

describe('On User Created Event handler', () => {
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

  it('should register a new log when a user is created', async () => {
    const adminUser = await userFactory.createAndPersist('admin');

    const token = await jwt.signAsync({
      name: adminUser.name,
      role: adminUser.role,
      sub: adminUser.id.toValue(),
    } as TokenPayload);

    const userName = 'Felipe';

    const response = await supertest(app.getHttpServer())
      .post('/user/new')
      .set({ Authorization: `Bearer ${token}` })
      .send({
        name: userName,
        email: 'fakeemail@gmail.com',
        password: 'fakepassword',
      } as CreateUserDto);

    await waitFor(async () => {
      const logsOnDb = await prisma.log.findMany();

      expect(logsOnDb.length).toBe(1);
    }, 10000);

    expect(response.ok).toBe(true);
  });
});
