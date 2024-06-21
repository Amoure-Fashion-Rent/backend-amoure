-- CreateEnum
CREATE TYPE "NgrokType" AS ENUM ('VTON', 'DEFAULT');

-- AlterTable
ALTER TABLE "ngrok_urls" ADD COLUMN     "type" "NgrokType" NOT NULL DEFAULT 'DEFAULT';

-- AlterTable
ALTER TABLE "products" ADD COLUMN     "similar_items" INTEGER[] DEFAULT ARRAY[]::INTEGER[];
