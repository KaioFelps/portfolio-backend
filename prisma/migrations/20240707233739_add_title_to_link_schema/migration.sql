/*
  Warnings:

  - Added the required column `title` to the `links` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "links" ADD COLUMN     "title" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "posts" ALTER COLUMN "publishedAt" SET DEFAULT null;
