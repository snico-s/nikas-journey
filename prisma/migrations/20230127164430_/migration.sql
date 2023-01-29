/*
  Warnings:

  - You are about to drop the column `createdBy` on the `TravelDay` table. All the data in the column will be lost.
  - Added the required column `userId` to the `TravelDay` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "TravelDay" DROP CONSTRAINT "TravelDay_createdBy_fkey";

-- AlterTable
ALTER TABLE "TravelDay" DROP COLUMN "createdBy",
ADD COLUMN     "userId" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "TravelDay" ADD CONSTRAINT "TravelDay_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
