-- AlterTable
CREATE SEQUENCE "collectiondays_travaldayid_seq";
ALTER TABLE "CollectionDays" ALTER COLUMN "travalDayId" SET DEFAULT nextval('collectiondays_travaldayid_seq');
ALTER SEQUENCE "collectiondays_travaldayid_seq" OWNED BY "CollectionDays"."travalDayId";
