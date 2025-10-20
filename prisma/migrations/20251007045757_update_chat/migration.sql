/*
  Warnings:

  - You are about to drop the column `private_key` on the `user_screet` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "public"."user_screet_private_key_key";

-- AlterTable
ALTER TABLE "user_screet" DROP COLUMN "private_key";
