/*
  Warnings:

  - Added the required column `receiver_id` to the `chat_message` table without a default value. This is not possible if the table is not empty.
  - Added the required column `user_id` to the `chat_message` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "chat_message" ADD COLUMN     "receiver_id" INTEGER NOT NULL,
ADD COLUMN     "user_id" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "chat_message" ADD CONSTRAINT "chat_message_receiver_id_fkey" FOREIGN KEY ("receiver_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "chat_message" ADD CONSTRAINT "chat_message_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
