/*
  Warnings:

  - The primary key for the `CollectionDays` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `travalDayId` on the `CollectionDays` table. All the data in the column will be lost.
  - Added the required column `travelDayId` to the `CollectionDays` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "CollectionDays" DROP CONSTRAINT "CollectionDays_travalDayId_fkey";

-- AlterTable
ALTER TABLE "CollectionDays" DROP CONSTRAINT "CollectionDays_pkey",
DROP COLUMN "travalDayId",
ADD COLUMN     "travelDayId" INTEGER NOT NULL,
ADD CONSTRAINT "CollectionDays_pkey" PRIMARY KEY ("routeCollectionId", "travelDayId");

-- AddForeignKey
ALTER TABLE "CollectionDays" ADD CONSTRAINT "CollectionDays_travelDayId_fkey" FOREIGN KEY ("travelDayId") REFERENCES "TravelDay"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
