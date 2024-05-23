/* eslint-disable camelcase */
import { config } from 'dotenv';
import { PrismaClient } from '@prisma/client';
import { execSync } from 'child_process';
import { randomUUID } from 'crypto';

config({
  path: '.env',
  override: true,
});

config({
  path: '.env.test',
  override: true,
});

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

const databaseId = `testDb${randomUUID()}`;

beforeEach(async () => {
  const databaseUrl = generate_postgresql_unique_database_url(databaseId);
  process.env.DATABASE_URL = databaseUrl;

  execSync('npx prisma migrate deploy');
});

afterEach(async () => {
  await prisma.$executeRawUnsafe(
    `DROP SCHEMA IF EXISTS "${databaseId}" CASCADE;`,
  );
  await prisma.$disconnect();
});
