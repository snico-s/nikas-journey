import { NextApiRequest, NextApiResponse } from "next";

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { method } = req;
  const { timeLineName, userId } = req.query;

  switch (method) {
    case "GET":
      if (!timeLineName || !userId || !(typeof timeLineName === "string"))
        return res.status(400).json({ error: "No timeLineName or userId" });
      try {
        const timeLine = await prisma.timeLine.findUnique({
          where: {
            userId_name: {
              userId: Number(userId),
              name: timeLineName,
            },
          },
          include: {
            timeLineHasTravelDays: {
              include: {
                travelDays: true,
              },
            },
          },
        });

        res.status(200).json(timeLine);
      } catch (error) {
        console.log(error);
        res.status(400).json({ success: false, error });
      }
      break;
  }
}
