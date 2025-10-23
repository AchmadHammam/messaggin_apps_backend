/*
  Warnings:

  - You are about to drop the column `user_id` on the `chat_message` table. All the data in the column will be lost.
  - Added the required column `reader_id` to the `chat_message` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "public"."chat_message" DROP CONSTRAINT "chat_message_user_id_fkey";

-- AlterTable
ALTER TABLE "chat_message" DROP COLUMN "user_id",
ADD COLUMN     "reader_id" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "chat_message" ADD CONSTRAINT "chat_message_reader_id_fkey" FOREIGN KEY ("reader_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
