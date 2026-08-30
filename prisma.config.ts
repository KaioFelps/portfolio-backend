import { config } from "dotenv";
import { expand } from "dotenv-expand";
import { defineConfig } from "prisma/config";

const env = config({override: false});
expand(env);

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: { path: "prisma/migrations" },
  datasource: { url: process.env["DIRECT_URL"] },
});
