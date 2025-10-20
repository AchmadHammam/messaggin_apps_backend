/*
  Warnings:

  - You are about to drop the column `isRead` on the `chat_message` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "chat_message" DROP COLUMN "isRead",
ADD COLUMN     "is_read" BOOLEAN NOT NULL DEFAULT false;
