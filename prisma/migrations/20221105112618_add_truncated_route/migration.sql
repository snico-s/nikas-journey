-- CreateTable
CREATE TABLE "TruncatedRoute" (
    "id" SERIAL NOT NULL,
    "coordinates" JSONB NOT NULL,
    "travelDayId" INTEGER,

    CONSTRAINT "TruncatedRoute_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "TruncatedRoute" ADD CONSTRAINT "TruncatedRoute_travelDayId_fkey" FOREIGN KEY ("travelDayId") REFERENCES "TravelDay"("id") ON DELETE SET NULL ON UPDATE CASCADE;
