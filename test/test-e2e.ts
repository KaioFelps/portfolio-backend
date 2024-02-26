import { config } from 'dotenv';
import { PrismaClient } from '@prisma/client';
import { execSync } from 'child_process';
import { randomInt } from 'crypto';

config({
  path: '.env',
  override: true,
});

config({
  path: '.env.test',
  override: true,
});

const prisma = new PrismaClient();

function generateUniqueDatabaseURL(databaseId: string) {
  if (!process.env.DATABASE_URL) {
    throw new Error('Please, provide a valid test database URL.');
  }

  const url = new URL(process.env.DATABASE_URL);
  url.pathname = '/' + databaseId;

  return url.toString();
}

const databaseId = `testDb${randomInt(100)}`;

beforeAll(async () => {
  const databaseUrl = generateUniqueDatabaseURL(databaseId);
  process.env.DATABASE_URL = databaseUrl;

  execSync('npx prisma migrate deploy');
});

afterAll(async () => {
  await prisma.$executeRawUnsafe(`DROP DATABASE IF EXISTS ${databaseId};`);
  await prisma.$disconnect();
});
