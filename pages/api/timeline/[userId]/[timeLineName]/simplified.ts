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
        const data = await prisma.timeLine.findUnique({
          where: {
            userId_name: {
              userId: Number(userId),
              name: timeLineName,
            },
          },
          include: {
            timeLineHasTravelDays: {
              include: {
                travelDays: {
                  include: {
                    route: {
                      select: {
                        simplifiedCoordinates: true,
                        travelDayId: true,
                      },
                    },
                  },
                },
              },
            },
          },
        });

        const travelDays = data?.timeLineHasTravelDays.map((travelDay) => {
          return travelDay.travelDays.route;
        });

        res.status(200).json(travelDays);
      } catch (error) {
        res.status(400).json({ success: false });
      }
      break;
  }
}
