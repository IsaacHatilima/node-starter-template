/*
  Warnings:

  - You are about to drop the column `revoked` on the `password_reset_tokens` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "password_reset_tokens" DROP COLUMN "revoked";

-- AlterTable
ALTER TABLE "refresh_tokens" ADD COLUMN     "revoked" BOOLEAN NOT NULL DEFAULT false;
