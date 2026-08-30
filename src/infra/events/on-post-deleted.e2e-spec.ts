import { INestApplication } from "@nestjs/common";
import supertest from "supertest";
import { UserFactory } from "test/factories/user-factory";
import { TokenPayload } from "../auth/jwt-strategy";
import { JwtService } from "@nestjs/jwt";
import { PrismaService } from "../db/prisma/prisma-service";
import { PostFactory } from "test/factories/post-factory";
import { LogAction } from "@/domain/logs/entities/log";
import { provisionTestApp } from "test/get-testing-app";

describe("On Post Edited Event handler", () => {
  let app: INestApplication;
  let jwt: JwtService;
  let prisma: PrismaService;
  let userFactory: UserFactory;
  let postFactory: PostFactory;

  beforeEach(async () => {
    app = await provisionTestApp();
    jwt = app.get(JwtService);
    prisma = app.get(PrismaService);
    userFactory = app.get(UserFactory);
    postFactory = app.get(PostFactory);
    await app.init();
  });

  it("should register a new log when a post is deleted", async () => {
    const user = await userFactory.createAndPersist("admin");
    const post = await postFactory.createAndPersist({ authorId: user.id });

    const token = await jwt.signAsync({
      name: user.name,
      role: user.role,
      sub: user.id.toValue(),
    } as TokenPayload);

    const response = await supertest(app.getHttpServer())
      .delete(`/post/${post.id.toValue()}/delete`)
      .set({ Authorization: `Bearer ${token}` })
      .send()
      .expect(200);

    await vi.waitFor(
      async () => {
        const logsOnDb = await prisma.log.findMany({
          where: { action: LogAction.deleted, target: post.title },
        });

        expect(logsOnDb.length).toBe(1);
      },
      { timeout: 10000, interval: 100 },
    );

    expect(response.ok).toBe(true);
  });
});
