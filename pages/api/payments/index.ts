import { Payment, PrismaClient } from "@prisma/client";
import type { NextApiRequest, NextApiResponse } from "next";

type Data = {
  success: boolean;
  data?: Payment | Payment[];
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  const prisma = new PrismaClient();

  switch (req.method) {
    case "GET":
      try {
        const payments = await prisma.payment.findMany({
          include: {
            travelDay: true,
          },
          orderBy: {
            travelDay: {
              date: "desc",
            },
          },
        });
        res.status(200).json({ success: true, data: payments });
      } catch (error) {
        res.status(400).json({ success: false });
      }
      break;
    case "POST":
      try {
        const payment = await prisma.payment.create({
          data: {
            amount: req.body.amount,
            category: req.body.category,
            description: req.body.description,
            currency: {
              connect: {
                isoCode: req.body.currency,
              },
            },
            travelDay: {
              connectOrCreate: {
                where: {
                  date: new Date(req.body.date),
                },
                create: {
                  date: new Date(req.body.date),
                },
              },
            },
          },
        });

        res.status(200).json({ success: true, data: payment });
      } catch (error) {
        res.status(400).json({ success: false });
      }
      break;
    default:
      res.status(400).json({ success: false });
      break;
  }
}
