import { PrismaClient } from "@prisma/client";
import { hash } from "bcryptjs";
const prisma = new PrismaClient();

async function main() {
  const password = process.env.START_PWD;

  const nika = await prisma.user.upsert({
    where: { id: 1 },
    update: {},
    create: {
      name: "Nika",
      email: "nika@mail.de",
      password: password ? await hash(password, 12) : "",
      isAdmin: true,
    },
  });

  const timeLine = await prisma.timeLine.upsert({
    where: { id: 1 },
    update: {},
    create: {
      name: "main",
      startDate: new Date("2022-04-05"),
      users: {
        connectOrCreate: {
          where: { id: 1 },
          create: {
            id: 1,
            name: "Nika",
            email: "nika@mail.de",
            password: password ? await hash(password, 12) : "",
            isAdmin: true,
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

  console.log({ euro, turkishLira, nika, timeLine });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
