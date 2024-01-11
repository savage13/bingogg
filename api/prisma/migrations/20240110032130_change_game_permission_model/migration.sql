/*
  Warnings:

  - You are about to drop the `GamePermission` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "GamePermission" DROP CONSTRAINT "GamePermission_gameId_fkey";

-- DropForeignKey
ALTER TABLE "GamePermission" DROP CONSTRAINT "GamePermission_userId_fkey";

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "staff" BOOLEAN NOT NULL DEFAULT false;

-- DropTable
DROP TABLE "GamePermission";

-- CreateTable
CREATE TABLE "_GameOwners" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "_GameModerators" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_GameOwners_AB_unique" ON "_GameOwners"("A", "B");

-- CreateIndex
CREATE INDEX "_GameOwners_B_index" ON "_GameOwners"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_GameModerators_AB_unique" ON "_GameModerators"("A", "B");

-- CreateIndex
CREATE INDEX "_GameModerators_B_index" ON "_GameModerators"("B");

-- AddForeignKey
ALTER TABLE "_GameOwners" ADD CONSTRAINT "_GameOwners_A_fkey" FOREIGN KEY ("A") REFERENCES "Game"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_GameOwners" ADD CONSTRAINT "_GameOwners_B_fkey" FOREIGN KEY ("B") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_GameModerators" ADD CONSTRAINT "_GameModerators_A_fkey" FOREIGN KEY ("A") REFERENCES "Game"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_GameModerators" ADD CONSTRAINT "_GameModerators_B_fkey" FOREIGN KEY ("B") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
