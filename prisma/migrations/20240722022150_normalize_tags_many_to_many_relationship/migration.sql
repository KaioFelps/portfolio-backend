/*
  Warnings:

  - You are about to drop the column `post_id` on the `tags` table. All the data in the column will be lost.
  - You are about to drop the column `project_id` on the `tags` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[value]` on the table `tags` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE "tags" DROP CONSTRAINT "tags_post_id_fkey";

-- DropForeignKey
ALTER TABLE "tags" DROP CONSTRAINT "tags_project_id_fkey";

-- AlterTable
ALTER TABLE "posts" ALTER COLUMN "publishedAt" SET DEFAULT null;

-- AlterTable
ALTER TABLE "tags" DROP COLUMN "post_id",
DROP COLUMN "project_id";

-- CreateTable
CREATE TABLE "tags_on_posts_or_projects" (
    "id" TEXT NOT NULL,
    "post_id" TEXT,
    "project_id" TEXT,
    "tagId" TEXT NOT NULL,

    CONSTRAINT "tags_on_posts_or_projects_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "tags_value_key" ON "tags"("value");

-- AddForeignKey
ALTER TABLE "tags_on_posts_or_projects" ADD CONSTRAINT "tags_on_posts_or_projects_post_id_fkey" FOREIGN KEY ("post_id") REFERENCES "posts"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tags_on_posts_or_projects" ADD CONSTRAINT "tags_on_posts_or_projects_project_id_fkey" FOREIGN KEY ("project_id") REFERENCES "projects"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tags_on_posts_or_projects" ADD CONSTRAINT "tags_on_posts_or_projects_tagId_fkey" FOREIGN KEY ("tagId") REFERENCES "tags"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
