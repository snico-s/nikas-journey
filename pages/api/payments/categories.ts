import { Payment, PrismaClient } from "@prisma/client";
import type { NextApiRequest, NextApiResponse } from "next";

type Data = {
  success: boolean;
  data?: (string | undefined)[];
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
          select: {
            category: true,
          },
          distinct: ["category"],
        });
        console.log(payments);

        const categories = payments
          .filter((payment) => {
            if (payment.category) return true;
            return false;
          })
          .map((payment) => {
            if (payment.category) return payment.category;
          });

        res.status(200).json({ success: true, data: categories });
      } catch (error) {
        res.status(400).json({ success: false });
      }
      break;
    default:
      res.status(400).json({ success: false });
      break;
  }
}
