import { INestApplication } from "@nestjs/common";
import supertest from "supertest";
import { UserFactory } from "test/factories/user-factory";
import { TokenPayload } from "../auth/jwt-strategy";
import { JwtService } from "@nestjs/jwt";
import { CreateProjectDto } from "../http/dtos/create-project";
import { PrismaService } from "../db/prisma/prisma-service";
import { waitFor } from "test/utlils/wait-for";
import { TagFactory } from "test/factories/tag-factory";
import { provisionTestApp } from "test/get-testing-app";

describe("On Project Created Event handler", () => {
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

  it("should register a new log when a project is created", async () => {
    const user = await userFactory.createAndPersist("admin");

    const token = await jwt.signAsync({
      name: user.name,
      role: user.role,
      sub: user.id.toValue(),
    } as TokenPayload);

    const tag = await tagFactory.createAndPersist({
      value: "front end",
    });

    const response = await supertest(app.getHttpServer())
      .post("/project/new")
      .set({ Authorization: `Bearer ${token}` })
      .send({
        title: "Portfólio",
        topstory: "https://i.imgur.com/NQ9ImcM.png",
        tags: [tag.id.toValue()],
        links: [{ title: "Deploy", value: "https://www.kaiofelps.dev" }],
      } as CreateProjectDto)
      .expect(201);

    await waitFor(async () => {
      const logsOnDb = await prisma.log.findMany();

      expect(logsOnDb.length).toBe(1);
    });

    expect(response.ok).toBe(true);
  });
});
