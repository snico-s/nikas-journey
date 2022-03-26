/*
  Warnings:

  - You are about to drop the column `userId` on the `RouteColleaction` table. All the data in the column will be lost.
  - You are about to drop the `travelDay` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `name` to the `TimeLine` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "CollectionDays" DROP CONSTRAINT "CollectionDays_travaldayId_fkey";

-- AlterTable
ALTER TABLE "Route" ADD COLUMN     "travelDayId" INTEGER;

-- AlterTable
ALTER TABLE "RouteColleaction" DROP COLUMN "userId";

-- AlterTable
ALTER TABLE "TimeLine" ADD COLUMN     "name" TEXT NOT NULL;

-- DropTable
DROP TABLE "travelDay";

-- CreateTable
CREATE TABLE "TravelDay" (
    "id" SERIAL NOT NULL,
    "title" TEXT,
    "body" TEXT,
    "date" TIMESTAMP(3) NOT NULL,
    "distance" DECIMAL(65,30),

    CONSTRAINT "TravelDay_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Payments" (
    "id" SERIAL NOT NULL,
    "amount" DECIMAL(65,30) NOT NULL,
    "currency" TEXT,
    "exchangeRate" DECIMAL(65,30),
    "category" TEXT,
    "description" TEXT,
    "travelDayId" INTEGER NOT NULL,

    CONSTRAINT "Payments_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "CollectionDays" ADD CONSTRAINT "CollectionDays_travaldayId_fkey" FOREIGN KEY ("travaldayId") REFERENCES "TravelDay"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Route" ADD CONSTRAINT "Route_travelDayId_fkey" FOREIGN KEY ("travelDayId") REFERENCES "TravelDay"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Payments" ADD CONSTRAINT "Payments_travelDayId_fkey" FOREIGN KEY ("travelDayId") REFERENCES "TravelDay"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
