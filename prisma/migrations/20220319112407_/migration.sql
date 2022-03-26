/*
  Warnings:

  - You are about to drop the column `data` on the `Route` table. All the data in the column will be lost.
  - You are about to drop the `_RouteColleactionToUser` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `coordinates` to the `Route` table without a default value. This is not possible if the table is not empty.
  - Added the required column `properties` to the `Route` table without a default value. This is not possible if the table is not empty.
  - Added the required column `type` to the `Route` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "_RouteColleactionToUser" DROP CONSTRAINT "_RouteColleactionToUser_A_fkey";

-- DropForeignKey
ALTER TABLE "_RouteColleactionToUser" DROP CONSTRAINT "_RouteColleactionToUser_B_fkey";

-- AlterTable
ALTER TABLE "Route" DROP COLUMN "data",
ADD COLUMN     "coordinates" JSONB NOT NULL,
ADD COLUMN     "properties" JSONB NOT NULL,
ADD COLUMN     "type" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "RouteColleaction" ADD COLUMN     "userId" INTEGER;

-- DropTable
DROP TABLE "_RouteColleactionToUser";

-- CreateTable
CREATE TABLE "TimeLine" (
    "id" SERIAL NOT NULL,
    "collectionId" INTEGER NOT NULL,
    "userId" INTEGER NOT NULL,

    CONSTRAINT "TimeLine_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "TimeLine" ADD CONSTRAINT "TimeLine_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TimeLine" ADD CONSTRAINT "TimeLine_collectionId_fkey" FOREIGN KEY ("collectionId") REFERENCES "RouteColleaction"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
