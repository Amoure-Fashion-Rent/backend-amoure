/*
  Warnings:

  - Added the required column `stylishNotes` to the `products` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "products" ADD COLUMN     "stylishNotes" TEXT NOT NULL,
ALTER COLUMN "status" SET DEFAULT 'AVAILABLE';
