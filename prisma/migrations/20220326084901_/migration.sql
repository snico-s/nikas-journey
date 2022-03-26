/*
  Warnings:

  - You are about to drop the column `currency` on the `Payments` table. All the data in the column will be lost.
  - You are about to drop the column `exchangeRate` on the `Payments` table. All the data in the column will be lost.
  - Added the required column `currencyId` to the `Payments` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Payments" DROP COLUMN "currency",
DROP COLUMN "exchangeRate",
ADD COLUMN     "currencyId" TEXT NOT NULL;

-- CreateTable
CREATE TABLE "Currency" (
    "isoCode" TEXT NOT NULL,
    "currency" TEXT NOT NULL,
    "exchangeRate" DECIMAL(65,30),

    CONSTRAINT "Currency_pkey" PRIMARY KEY ("isoCode")
);

-- CreateIndex
CREATE UNIQUE INDEX "Currency_currency_key" ON "Currency"("currency");

-- AddForeignKey
ALTER TABLE "Payments" ADD CONSTRAINT "Payments_currencyId_fkey" FOREIGN KEY ("currencyId") REFERENCES "Currency"("isoCode") ON DELETE RESTRICT ON UPDATE CASCADE;
