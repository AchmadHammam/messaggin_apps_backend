/*
  Warnings:

  - You are about to drop the `category_product` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `product` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "public"."product" DROP CONSTRAINT "product_category_product_id_fkey";

-- DropTable
DROP TABLE "public"."category_product";

-- DropTable
DROP TABLE "public"."product";
