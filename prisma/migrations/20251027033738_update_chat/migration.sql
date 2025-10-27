-- DropForeignKey
ALTER TABLE "public"."chat_message" DROP CONSTRAINT "chat_message_receiver_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."chat_message" DROP CONSTRAINT "chat_message_sender_id_fkey";

-- AddForeignKey
ALTER TABLE "chat_message" ADD CONSTRAINT "chat_message_sender_id_fkey" FOREIGN KEY ("sender_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "chat_message" ADD CONSTRAINT "chat_message_receiver_id_fkey" FOREIGN KEY ("receiver_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
