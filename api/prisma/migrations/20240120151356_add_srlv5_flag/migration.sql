/*
  Warnings:

  - You are about to drop the column `srlv5Enabled` on the `Game` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Game" DROP COLUMN "srlv5Enabled",
ADD COLUMN     "enableSRLv5" BOOLEAN NOT NULL DEFAULT false;
