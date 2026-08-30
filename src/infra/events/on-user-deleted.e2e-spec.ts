import { INestApplication } from "@nestjs/common";

import supertest from "supertest";
import { UserFactory } from "test/factories/user-factory";
import { TokenPayload } from "../auth/jwt-strategy";
import { JwtService } from "@nestjs/jwt";
import { PrismaService } from "../db/prisma/prisma-service";
import { waitFor } from "test/utlils/wait-for";
import { LogAction } from "@/domain/logs/entities/log";
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

  it("should register a new log when a user is deleted", async () => {
    const adminUser = await userFactory.createAndPersist("admin");
    const user = await userFactory.createAndPersist("editor");

    const token = await jwt.signAsync({
      name: adminUser.name,
      role: adminUser.role,
      sub: adminUser.id.toValue(),
    } as TokenPayload);

    const response = await supertest(app.getHttpServer())
      .delete(`/user/${user.id.toValue()}/delete`)
      .set({ Authorization: `Bearer ${token}` })
      .send()
      .expect(204);

    await waitFor(async () => {
      const logsOnDb = await prisma.log.findMany({
        where: { action: LogAction.deleted, target: user.name },
      });

      expect(logsOnDb.length).toBe(1);
    });

    expect(response.ok).toBe(true);
  });
});
