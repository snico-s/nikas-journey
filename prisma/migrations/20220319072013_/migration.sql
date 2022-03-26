-- AlterTable
ALTER TABLE "Post" ALTER COLUMN "title" DROP NOT NULL;

-- CreateTable
CREATE TABLE "_RouteColleactionToUser" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_RouteColleactionToUser_AB_unique" ON "_RouteColleactionToUser"("A", "B");

-- CreateIndex
CREATE INDEX "_RouteColleactionToUser_B_index" ON "_RouteColleactionToUser"("B");

-- AddForeignKey
ALTER TABLE "Post" ADD CONSTRAINT "Post_collectionId_fkey" FOREIGN KEY ("collectionId") REFERENCES "RouteColleaction"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_RouteColleactionToUser" ADD FOREIGN KEY ("A") REFERENCES "RouteColleaction"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_RouteColleactionToUser" ADD FOREIGN KEY ("B") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
