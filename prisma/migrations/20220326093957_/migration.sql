/*
  Warnings:

  - A unique constraint covering the columns `[date]` on the table `TravelDay` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "TravelDay_date_key" ON "TravelDay"("date");
