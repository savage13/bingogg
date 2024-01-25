/*
  Warnings:

  - You are about to drop the column `oAuthApplicationId` on the `OAuthToken` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[userId,oAuthClientId]` on the table `OAuthToken` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `oAuthClientId` to the `OAuthToken` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "OAuthToken" DROP CONSTRAINT "OAuthToken_oAuthApplicationId_fkey";

-- AlterTable
ALTER TABLE "OAuthToken" DROP COLUMN "oAuthApplicationId",
ADD COLUMN     "oAuthClientId" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "OAuthToken_userId_oAuthClientId_key" ON "OAuthToken"("userId", "oAuthClientId");

-- AddForeignKey
ALTER TABLE "OAuthToken" ADD CONSTRAINT "OAuthToken_oAuthClientId_fkey" FOREIGN KEY ("oAuthClientId") REFERENCES "OAuthClient"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
