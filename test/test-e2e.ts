/* eslint-disable camelcase */
import { config } from "dotenv";
import { expand } from "dotenv-expand";
import { execSync } from "child_process";
import { PrismaClient } from "prisma/generated/client";
import { PrismaPg } from "@prisma/adapter-pg";

import { createPgAdapter } from "@/infra/db/prisma/create-adapter";

expand(config({ path: ".env", override: true }));
expand(config({ path: ".env.test", override: true }));

function generatePostgresqlUniqueDatabaseUrl(databaseId: string) {
  if (!process.env.DATABASE_URL) {
    throw new Error("Please, provide a valid test database URL.");
  }
  const url = new URL(process.env.DATABASE_URL);
  url.searchParams.set("schema", databaseId);
  return url.toString();
}

let counter = 0;
let databaseId: string;
let prisma: PrismaClient;
const databaseSchemas = new Array<string>();

beforeEach(async (context) => {
  databaseId = `test-db${context.task.id}-${counter++}`;
  const databaseUrl = generatePostgresqlUniqueDatabaseUrl(databaseId);
  process.env.DATABASE_URL = databaseUrl;
  process.env.DIRECT_URL = databaseUrl;

  execSync("npx prisma migrate deploy");

  prisma = new PrismaClient({ adapter: createPgAdapter(databaseUrl) });
});

afterEach(async () => {
  databaseSchemas.push(databaseId);
  await prisma.$disconnect();
});

afterAll(async () => {
  // needs its own client since `prisma` is already disconnected/scoped to the last test
  const cleanupUrl = process.env.DATABASE_URL!;
  const cleanupClient = new PrismaClient({
    adapter: new PrismaPg({ connectionString: cleanupUrl }),
  });
  for (const schema of databaseSchemas) {
    await cleanupClient.$executeRawUnsafe(`DROP SCHEMA IF EXISTS "${schema}" CASCADE;`);
  }
  await cleanupClient.$disconnect();
});
