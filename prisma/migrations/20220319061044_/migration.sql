/*
  Warnings:

  - You are about to drop the column `title` on the `Route` table. All the data in the column will be lost.
  - Added the required column `data` to the `Route` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Route" DROP COLUMN "title",
ADD COLUMN     "data" JSONB NOT NULL;

-- CreateTable
CREATE TABLE "Post" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "body" TEXT NOT NULL,
    "collectionId" INTEGER NOT NULL,
    "userId" INTEGER NOT NULL,

    CONSTRAINT "Post_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RouteColleaction" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "startDate" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "RouteColleaction_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CollectionDays" (
    "routeCollectionId" INTEGER NOT NULL,
    "travaldayId" INTEGER NOT NULL,

    CONSTRAINT "CollectionDays_pkey" PRIMARY KEY ("routeCollectionId","travaldayId")
);

-- CreateTable
CREATE TABLE "travelDay" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "body" TEXT NOT NULL,
    "date" TEXT NOT NULL,

    CONSTRAINT "travelDay_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Post" ADD CONSTRAINT "Post_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CollectionDays" ADD CONSTRAINT "CollectionDays_routeCollectionId_fkey" FOREIGN KEY ("routeCollectionId") REFERENCES "RouteColleaction"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CollectionDays" ADD CONSTRAINT "CollectionDays_travaldayId_fkey" FOREIGN KEY ("travaldayId") REFERENCES "travelDay"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
