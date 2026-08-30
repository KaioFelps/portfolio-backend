import { INestApplication } from "@nestjs/common";

import supertest from "supertest";
import { UserFactory } from "test/factories/user-factory";
import { TokenPayload } from "../auth/jwt-strategy";
import { JwtService } from "@nestjs/jwt";
import { CreateUserDto } from "../http/dtos/create-user";
import { PrismaService } from "../db/prisma/prisma-service";
import { waitFor } from "test/utlils/wait-for";
import { provisionTestApp } from "test/get-testing-app";

describe("On User Created Event handler", () => {
  let app: INestApplication;
  let jwt: JwtService;
  let prisma: PrismaService;
  let userFactory: UserFactory;

  beforeEach(async () => {
    app = await provisionTestApp();
    jwt = app.get(JwtService);
    prisma = app.get(PrismaService);
    userFactory = app.get(UserFactory);

    await app.init();
  });

  it("should register a new log when a user is created", async () => {
    const adminUser = await userFactory.createAndPersist("admin");

    const token = await jwt.signAsync({
      name: adminUser.name,
      role: adminUser.role,
      sub: adminUser.id.toValue(),
    } as TokenPayload);

    const userName = "Felipe";

    const response = await supertest(app.getHttpServer())
      .post("/user/new")
      .set({ Authorization: `Bearer ${token}` })
      .send({
        name: userName,
        email: "fakeemail@gmail.com",
        password: "fakepassword",
      } as CreateUserDto);

    await waitFor(async () => {
      const logsOnDb = await prisma.log.findMany();

      expect(logsOnDb.length).toBe(1);
    });

    expect(response.ok).toBe(true);
  });
});
