-- AlterTable
ALTER TABLE "posts" ADD COLUMN     "description" VARCHAR(255) NOT NULL DEFAULT '',
ALTER COLUMN "publishedAt" SET DEFAULT null;
