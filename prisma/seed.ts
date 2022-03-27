import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function main() {
  const nika = await prisma.user.upsert({
    where: { id: 1 },
    update: {},
    create: {
      name: "Nika",
    },
  });

  const routeColleaction = await prisma.routeColleaction.upsert({
    where: { id: 1 },
    update: {},
    create: {
      name: "main",
      startDate: new Date("2022-04-02"),
    },
  });

  const timeLine = await prisma.timeLine.upsert({
    where: { id: 1 },
    update: {},
    create: {
      name: "main",
      users: {
        connectOrCreate: {
          where: { id: 1 },
          create: {
            id: 1,
            name: "Nika",
          },
        },
      },
      routeColleaction: {
        connectOrCreate: {
          where: { id: 1 },
          create: {
            id: 1,
            name: "main",
            startDate: new Date("2022-04-02"),
          },
        },
      },
    },
  });

  const turkishLira = await prisma.currency.upsert({
    where: { isoCode: "TRY" },
    update: {},
    create: {
      isoCode: "TRY",
      currency: "Türkische Lira",
      exchangeRate: 0.061,
    },
  });

  const euro = await prisma.currency.upsert({
    where: { isoCode: "EUR" },
    update: {},
    create: {
      isoCode: "EUR",
      currency: "Euro",
      exchangeRate: 1,
    },
  });

  console.log({ euro, turkishLira, nika, routeColleaction, timeLine });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
