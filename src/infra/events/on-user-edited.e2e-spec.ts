import { INestApplication } from "@nestjs/common";

import supertest from "supertest";
import { UserFactory } from "test/factories/user-factory";
import { TokenPayload } from "../auth/jwt-strategy";
import { JwtService } from "@nestjs/jwt";
import { PrismaService } from "../db/prisma/prisma-service";
import { UpdateUserDto } from "../http/dtos/update-user";
import { LogAction, LogTargetType } from "prisma/generated/client";
import { provisionTestApp } from "test/get-testing-app";

describe("On User Edited Event handler", () => {
  let app: INestApplication;
  let jwt: JwtService;
  let prisma: PrismaService;
  let userFactory: UserFactory;

  beforeEach(async () => {
    app = await provisionTestApp();
    jwt = app.get(JwtService);
    prisma = app.get(PrismaService);
    userFactory = app.get(UserFactory);
    userFactory = app.get(UserFactory);
    await app.init();
  });

  it("should register a new log when a user is edited", async () => {
    const adminUser = await userFactory.createAndPersist("admin");
    const user = await userFactory.createAndPersist("editor");

    const token = await jwt.signAsync({
      name: adminUser.name,
      role: adminUser.role,
      sub: adminUser.id.toValue(),
    } as TokenPayload);

    const newUserName = "Edited Name";

    const response = await supertest(app.getHttpServer())
      .put(`/user/${user.id.toValue()}/edit`)
      .set({ Authorization: `Bearer ${token}` })
      .send({
        name: newUserName,
      } as UpdateUserDto)
      .expect(204);

    await vi.waitFor(async () => {
      const logsOnDb = await prisma.log.findMany({
        where: {
          action: LogAction.UPDATED,
          targetType: LogTargetType.USER,
          target: newUserName,
        },
      });

      expect(logsOnDb.length).toBe(1);
    });

    expect(response.ok).toBe(true);
  });
});
