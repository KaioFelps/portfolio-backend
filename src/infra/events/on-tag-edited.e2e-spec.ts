import { INestApplication } from "@nestjs/common";
import supertest from "supertest";
import { UserFactory } from "test/factories/user-factory";
import { TokenPayload } from "../auth/jwt-strategy";
import { JwtService } from "@nestjs/jwt";
import { PrismaService } from "../db/prisma/prisma-service";
import { TagFactory } from "test/factories/tag-factory";
import { LogAction, LogTargetType } from "prisma/generated/client";
import { UpdateTagDto } from "../http/dtos/update-tag";
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

  it("should register a new log when a tag is edited", async () => {
    const user = await userFactory.createAndPersist("admin");
    const tag = await tagFactory.createAndPersist();

    const token = await jwt.signAsync({
      name: user.name,
      role: user.role,
      sub: user.id.toValue(),
    } as TokenPayload);

    const newTagValue = "Tereré";

    const response = await supertest(app.getHttpServer())
      .patch(`/tag/${tag.id.toValue()}/edit`)
      .set({ Authorization: `Bearer ${token}` })
      .send({
        value: newTagValue,
      } as UpdateTagDto)
      .expect(200);

    await vi.waitFor(async () => {
      const logsOnDb = await prisma.log.findMany({
        where: {
          action: LogAction.UPDATED,
          targetType: LogTargetType.TAG,
          target: newTagValue,
        },
      });

      expect(logsOnDb.length).toBe(1);
    });

    expect(response.ok).toBe(true);
  });
});
