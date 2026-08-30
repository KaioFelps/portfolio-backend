import { INestApplication } from "@nestjs/common";
import supertest from "supertest";
import { UserFactory } from "test/factories/user-factory";
import { TokenPayload } from "../auth/jwt-strategy";
import { JwtService } from "@nestjs/jwt";
import { PrismaService } from "../db/prisma/prisma-service";
import { waitFor } from "test/utlils/wait-for";
import { TagFactory } from "test/factories/tag-factory";
import { LogAction } from "@/domain/logs/entities/log";
import { provisionTestApp } from "test/get-testing-app";

describe("On Tag Edited Event handler", () => {
  let app: INestApplication;
  let jwt: JwtService;
  let prisma: PrismaService;
  let userFactory: UserFactory;
  let tagFactory: TagFactory;

  beforeEach(async () => {
    app = await provisionTestApp();
    jwt = app.get(JwtService);
    prisma = app.get(PrismaService);
    userFactory = app.get(UserFactory);
    tagFactory = app.get(TagFactory);
    await app.init();
  });

  it("should register a new log when a tag is deleted", async () => {
    const user = await userFactory.createAndPersist("admin");
    const tag = await tagFactory.createAndPersist();

    const token = await jwt.signAsync({
      name: user.name,
      role: user.role,
      sub: user.id.toValue(),
    } as TokenPayload);

    const response = await supertest(app.getHttpServer())
      .delete(`/tag/${tag.id.toValue()}/delete`)
      .set({ Authorization: `Bearer ${token}` })
      .send()
      .expect(204);

    await waitFor(async () => {
      const logsOnDb = await prisma.log.findMany({
        where: {
          action: LogAction.deleted,
          target: tag.value,
          targetType: "TAG",
        },
      });

      expect(logsOnDb.length).toBe(1);
    });

    expect(response.ok).toBe(true);
  });
});
