/*
  Warnings:

  - The required column `id` was added to the `logs` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.

*/
-- DropForeignKey
ALTER TABLE `logs` DROP FOREIGN KEY `logs_dispatcher_id_fkey`;

-- AlterTable
ALTER TABLE `logs` ADD COLUMN `id` VARCHAR(191) NOT NULL,
    MODIFY `dispatcher_id` VARCHAR(191) NULL,
    ADD PRIMARY KEY (`id`);

-- AddForeignKey
ALTER TABLE `logs` ADD CONSTRAINT `logs_dispatcher_id_fkey` FOREIGN KEY (`dispatcher_id`) REFERENCES `users`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
