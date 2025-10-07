/*
  Warnings:

  - You are about to drop the column `user_id` on the `chat_message` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "public"."chat_message" DROP CONSTRAINT "chat_message_user_id_fkey";

-- AlterTable
ALTER TABLE "chat_message" DROP COLUMN "user_id";

-- AddForeignKey
ALTER TABLE "chat_message" ADD CONSTRAINT "chat_message_sender_id_fkey" FOREIGN KEY ("sender_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
