-- AlterEnum
ALTER TYPE "LogTargetType" ADD VALUE 'TAG';

-- DropForeignKey
ALTER TABLE "posts" DROP CONSTRAINT "posts_author_id_fkey";

-- AlterTable
ALTER TABLE "posts" ALTER COLUMN "publishedAt" SET DEFAULT null;

-- AddForeignKey
ALTER TABLE "posts" ADD CONSTRAINT "posts_author_id_fkey" FOREIGN KEY ("author_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE CASCADE;
