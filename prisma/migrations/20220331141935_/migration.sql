/*
  Warnings:

  - You are about to drop the column `collectionId` on the `Post` table. All the data in the column will be lost.
  - You are about to drop the column `collectionId` on the `TimeLine` table. All the data in the column will be lost.
  - You are about to drop the `CollectionDays` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `RouteColleaction` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `timeLineId` to the `Post` table without a default value. This is not possible if the table is not empty.
  - Added the required column `startDate` to the `TimeLine` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "CollectionDays" DROP CONSTRAINT "CollectionDays_routeCollectionId_fkey";

-- DropForeignKey
ALTER TABLE "CollectionDays" DROP CONSTRAINT "CollectionDays_travelDayId_fkey";

-- DropForeignKey
ALTER TABLE "Post" DROP CONSTRAINT "Post_collectionId_fkey";

-- DropForeignKey
ALTER TABLE "TimeLine" DROP CONSTRAINT "TimeLine_collectionId_fkey";

-- AlterTable
ALTER TABLE "Post" DROP COLUMN "collectionId",
ADD COLUMN     "timeLineId" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "TimeLine" DROP COLUMN "collectionId",
ADD COLUMN     "startDate" TIMESTAMP(3) NOT NULL;

-- DropTable
DROP TABLE "CollectionDays";

-- DropTable
DROP TABLE "RouteColleaction";

-- CreateTable
CREATE TABLE "TimeLineHasTravelDays" (
    "timeLineId" INTEGER NOT NULL,
    "travelDayId" INTEGER NOT NULL,

    CONSTRAINT "TimeLineHasTravelDays_pkey" PRIMARY KEY ("timeLineId","travelDayId")
);

-- AddForeignKey
ALTER TABLE "Post" ADD CONSTRAINT "Post_timeLineId_fkey" FOREIGN KEY ("timeLineId") REFERENCES "TimeLine"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TimeLineHasTravelDays" ADD CONSTRAINT "TimeLineHasTravelDays_timeLineId_fkey" FOREIGN KEY ("timeLineId") REFERENCES "TimeLine"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TimeLineHasTravelDays" ADD CONSTRAINT "TimeLineHasTravelDays_travelDayId_fkey" FOREIGN KEY ("travelDayId") REFERENCES "TravelDay"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
