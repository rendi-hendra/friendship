/*
  Warnings:

  - You are about to drop the column `email` on the `user` table. All the data in the column will be lost.
  - Added the required column `password` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX `User_email_key` ON `user`;

-- AlterTable
ALTER TABLE `user` DROP COLUMN `email`,
    ADD COLUMN `password` VARCHAR(255) NOT NULL,
    ADD COLUMN `token` VARCHAR(255) NULL,
    MODIFY `username` VARCHAR(255) NOT NULL;
