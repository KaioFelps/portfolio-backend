/* eslint-disable camelcase */
import { config } from 'dotenv';
import { expand } from 'dotenv-expand';
import { execSync } from 'child_process';
import { PrismaClient } from '@prisma/client';

expand(
  config({
    path: '.env',
    override: true,
  }),
);

expand(
  config({
    path: '.env.test',
    override: true,
  }),
);

const prisma = new PrismaClient();

function _generate_mysql_unique_database_url(databaseId: string) {
  if (!process.env.DATABASE_URL) {
    throw new Error('Please, provide a valid test database URL.');
  }

  const url = new URL(process.env.DATABASE_URL);
  url.pathname = '/' + databaseId;

  return url.toString();
}

function generate_postgresql_unique_database_url(databaseId: string) {
  if (!process.env.DATABASE_URL) {
    throw new Error('Please, provide a valid test database URL.');
  }

  const url = new URL(process.env.DATABASE_URL);
  url.searchParams.set('schema', databaseId);

  return url.toString();
}

let counter = 0;
let databaseId: string;
const databaseSchemas = new Array<string>();

beforeEach(async (context) => {
  databaseId = `test-db${context.task.id}-${counter++}`;

  const databaseUrl = generate_postgresql_unique_database_url(databaseId);
  process.env.DATABASE_URL = databaseUrl;
  process.env.DIRECT_URL = databaseUrl;

  execSync('npx prisma migrate deploy');
});

afterEach(async () => {
  databaseSchemas.push(databaseId);
  await prisma.$disconnect();
});

afterAll(async () => {
  for (const schema of databaseSchemas) {
    await prisma.$executeRawUnsafe(
      `DROP SCHEMA IF EXISTS "${schema}" CASCADE;`,
    );
  }
});
