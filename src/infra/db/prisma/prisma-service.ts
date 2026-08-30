import { EnvService } from "@/infra/env/env-service";
import { Injectable, OnModuleDestroy, OnModuleInit } from "@nestjs/common";
import { PrismaClient } from "prisma/generated/client";
import { createPgAdapter } from "./create-adapter";

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  constructor(env: EnvService) {
    const connectionString = env.get("DATABASE_URL");
    super({
      adapter: createPgAdapter(connectionString),
      log: ["warn", "error"],
    });
  }

  onModuleInit() {
    return this.$connect();
  }

  onModuleDestroy() {
    this.$disconnect();
  }
}
