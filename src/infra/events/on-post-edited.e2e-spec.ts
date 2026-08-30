import { INestApplication } from "@nestjs/common";
import supertest from "supertest";
import { UserFactory } from "test/factories/user-factory";
import { TokenPayload } from "../auth/jwt-strategy";
import { JwtService } from "@nestjs/jwt";
import { CreatePostDto } from "../http/dtos/create-post";
import { PrismaService } from "../db/prisma/prisma-service";
import { waitFor } from "test/utlils/wait-for";
import { PostFactory } from "test/factories/post-factory";
import { TagFactory } from "test/factories/tag-factory";
import { LogAction, LogTargetType } from "@/domain/logs/entities/log";
import { provisionTestApp } from "test/get-testing-app";

describe("On Post Edited Event handler", () => {
  let app: INestApplication;
  let jwt: JwtService;
  let prisma: PrismaService;
  let userFactory: UserFactory;
  let postFactory: PostFactory;
  let tagFactory: TagFactory;

  beforeEach(async () => {
    app = await provisionTestApp();
    jwt = app.get(JwtService);
    prisma = app.get(PrismaService);
    userFactory = app.get(UserFactory);
    postFactory = app.get(PostFactory);
    tagFactory = app.get(TagFactory);
    await app.init();
  });

  it("should register a new log when a post is edited", async () => {
    const user = await userFactory.createAndPersist("admin");
    const post = await postFactory.createAndPersist({ authorId: user.id });

    const token = await jwt.signAsync({
      name: user.name,
      role: user.role,
      sub: user.id.toValue(),
    } as TokenPayload);

    const newPostTitle = "Título editadooo!!";

    const tagEventos = await tagFactory.createAndPersist({ value: "eventos" });

    const response = await supertest(app.getHttpServer())
      .put(`/post/${post.id.toValue()}/edit`)
      .set({ Authorization: `Bearer ${token}` })
      .send({
        tags: [tagEventos.id.toValue()],
        title: newPostTitle,
      } as CreatePostDto);

    await waitFor(async () => {
      const logsOnDb = await prisma.log.findMany({
        where: {
          action: LogAction.updated,
          targetType: LogTargetType.post,
        },
      });

      expect(logsOnDb.length).toBe(1);
    });

    expect(response.ok).toBe(true);
  });
});
