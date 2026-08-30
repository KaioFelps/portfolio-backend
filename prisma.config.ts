import { config } from "dotenv";
import { expand } from "dotenv-expand";
import { defineConfig, env } from "prisma/config";

expand(config({ override: false }));

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: { path: "prisma/migrations" },
  datasource: { url: env("DIRECT_URL") },
});
