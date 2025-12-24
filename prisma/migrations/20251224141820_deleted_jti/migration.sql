/*
  Warnings:

  - You are about to drop the column `jti` on the `refresh_tokens` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "refresh_tokens_jti_key";

-- AlterTable
ALTER TABLE "refresh_tokens" DROP COLUMN "jti";
