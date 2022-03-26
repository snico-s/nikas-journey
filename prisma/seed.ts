import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function main() {
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
  console.log({ euro, turkishLira });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
