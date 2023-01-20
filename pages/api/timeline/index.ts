import { NextApiRequest, NextApiResponse } from "next";

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { method } = req;

  switch (method) {
    case "GET":
      try {
        const data = await prisma.timeLine.findUnique({
          where: {
            userId_name: {
              userId: 1,
              name: "main",
            },
          },
          include: {
            timeLineHasTravelDays: {
              include: {
                travelDays: {
                  include: {
                    route: {
                      select: {
                        coordinates: true,
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
