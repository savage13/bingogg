/*
  Warnings:

  - Added the required column `gameId` to the `Room` table without a default value. This is not possible if the table is not empty.
  - Added the required column `name` to the `Room` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "RoomActionType" AS ENUM ('JOIN', 'LEAVE', 'MARK', 'UNMARK', 'CHAT', 'CHANGECOLOR');

-- AlterTable
ALTER TABLE "Room" ADD COLUMN     "gameId" TEXT NOT NULL,
ADD COLUMN     "name" TEXT NOT NULL;

-- CreateTable
CREATE TABLE "RoomAction" (
    "id" TEXT NOT NULL,
    "action" "RoomActionType" NOT NULL,
    "payload" JSONB NOT NULL,
    "roomId" TEXT NOT NULL,

    CONSTRAINT "RoomAction_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "RoomAction_id_key" ON "RoomAction"("id");

-- AddForeignKey
ALTER TABLE "Room" ADD CONSTRAINT "Room_gameId_fkey" FOREIGN KEY ("gameId") REFERENCES "Game"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RoomAction" ADD CONSTRAINT "RoomAction_roomId_fkey" FOREIGN KEY ("roomId") REFERENCES "Room"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
