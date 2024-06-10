/*
  Warnings:

  - You are about to drop the column `pulishedAt` on the `posts` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "posts" DROP COLUMN "pulishedAt",
ADD COLUMN     "publishedAt" TIMESTAMP(3) DEFAULT null;
