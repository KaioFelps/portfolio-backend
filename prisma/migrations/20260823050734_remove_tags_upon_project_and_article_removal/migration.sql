-- DropForeignKey
ALTER TABLE "tags_on_posts_or_projects" DROP CONSTRAINT "tags_on_posts_or_projects_post_id_fkey";

-- DropForeignKey
ALTER TABLE "tags_on_posts_or_projects" DROP CONSTRAINT "tags_on_posts_or_projects_project_id_fkey";

-- DropForeignKey
ALTER TABLE "tags_on_posts_or_projects" DROP CONSTRAINT "tags_on_posts_or_projects_tagId_fkey";

-- AlterTable
ALTER TABLE "posts" ALTER COLUMN "publishedAt" SET DEFAULT null;

-- AddForeignKey
ALTER TABLE "tags_on_posts_or_projects" ADD CONSTRAINT "tags_on_posts_or_projects_post_id_fkey" FOREIGN KEY ("post_id") REFERENCES "posts"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tags_on_posts_or_projects" ADD CONSTRAINT "tags_on_posts_or_projects_project_id_fkey" FOREIGN KEY ("project_id") REFERENCES "projects"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tags_on_posts_or_projects" ADD CONSTRAINT "tags_on_posts_or_projects_tagId_fkey" FOREIGN KEY ("tagId") REFERENCES "tags"("id") ON DELETE CASCADE ON UPDATE CASCADE;
