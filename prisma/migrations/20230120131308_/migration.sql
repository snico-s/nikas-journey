-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "isAdmin" BOOLEAN NOT NULL DEFAULT false,
    "password" TEXT NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TimeLine" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "startDate" TIMESTAMP(3) NOT NULL,
    "userId" INTEGER NOT NULL,

    CONSTRAINT "TimeLine_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Post" (
    "id" SERIAL NOT NULL,
    "title" TEXT,
    "body" TEXT NOT NULL,
    "userId" INTEGER NOT NULL,
    "timeLineId" INTEGER NOT NULL,

    CONSTRAINT "Post_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TimeLineHasTravelDays" (
    "timeLineId" INTEGER NOT NULL,
    "travelDayId" INTEGER NOT NULL,

    CONSTRAINT "TimeLineHasTravelDays_pkey" PRIMARY KEY ("timeLineId","travelDayId")
);

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
CREATE TABLE "Route" (
    "id" SERIAL NOT NULL,
    "type" TEXT NOT NULL,
    "coordinates" JSONB NOT NULL,
    "properties" JSONB NOT NULL,
    "travelDayId" INTEGER,

    CONSTRAINT "Route_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Payment" (
    "id" SERIAL NOT NULL,
    "amount" DECIMAL(65,30) NOT NULL,
    "category" TEXT,
    "description" TEXT,
    "travelDayId" INTEGER NOT NULL,
    "currencyId" TEXT NOT NULL,

    CONSTRAINT "Payment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Currency" (
    "isoCode" TEXT NOT NULL,
    "currency" TEXT NOT NULL,
    "exchangeRate" DECIMAL(65,30),

    CONSTRAINT "Currency_pkey" PRIMARY KEY ("isoCode")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "TimeLine_userId_name_key" ON "TimeLine"("userId", "name");

-- CreateIndex
CREATE UNIQUE INDEX "TravelDay_date_key" ON "TravelDay"("date");

-- CreateIndex
CREATE UNIQUE INDEX "Currency_currency_key" ON "Currency"("currency");

-- AddForeignKey
ALTER TABLE "TimeLine" ADD CONSTRAINT "TimeLine_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Post" ADD CONSTRAINT "Post_timeLineId_fkey" FOREIGN KEY ("timeLineId") REFERENCES "TimeLine"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Post" ADD CONSTRAINT "Post_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TimeLineHasTravelDays" ADD CONSTRAINT "TimeLineHasTravelDays_timeLineId_fkey" FOREIGN KEY ("timeLineId") REFERENCES "TimeLine"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TimeLineHasTravelDays" ADD CONSTRAINT "TimeLineHasTravelDays_travelDayId_fkey" FOREIGN KEY ("travelDayId") REFERENCES "TravelDay"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Route" ADD CONSTRAINT "Route_travelDayId_fkey" FOREIGN KEY ("travelDayId") REFERENCES "TravelDay"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Payment" ADD CONSTRAINT "Payment_currencyId_fkey" FOREIGN KEY ("currencyId") REFERENCES "Currency"("isoCode") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Payment" ADD CONSTRAINT "Payment_travelDayId_fkey" FOREIGN KEY ("travelDayId") REFERENCES "TravelDay"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
