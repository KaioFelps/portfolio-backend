import { INestApplication } from "@nestjs/common";
import supertest from "supertest";
import { UserFactory } from "test/factories/user-factory";
import { TokenPayload } from "../auth/jwt-strategy";
import { JwtService } from "@nestjs/jwt";
import { CreateTagDto } from "../http/dtos/create-tag";
import { PrismaService } from "../db/prisma/prisma-service";
import { provisionTestApp } from "test/get-testing-app";

describe("On Tag Created Event handler", () => {
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

  it("should register a new log when a tag is created", async () => {
    const user = await userFactory.createAndPersist("editor");

    const token = await jwt.signAsync({
      name: user.name,
      role: user.role,
      sub: user.id.toValue(),
    } as TokenPayload);

    const response = await supertest(app.getHttpServer())
      .post("/tag/new")
      .set({ Authorization: `Bearer ${token}` })
      .send({
        value: "Rust",
      } as CreateTagDto)
      .expect(201);

    await vi.waitFor(async () => {
      const logsOnDb = await prisma.log.findMany();

      expect(logsOnDb.length).toBe(1);
    });

    expect(response.ok).toBe(true);
  });
});
