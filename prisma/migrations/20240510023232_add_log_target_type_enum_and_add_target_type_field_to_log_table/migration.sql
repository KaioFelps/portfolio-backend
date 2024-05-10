/*
  Warnings:

  - Added the required column `targetType` to the `logs` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `logs` ADD COLUMN `targetType` ENUM('POST', 'PROJECT', 'USER') NOT NULL;
