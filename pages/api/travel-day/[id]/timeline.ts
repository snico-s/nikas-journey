import { PrismaClient, Route, TimeLineHasTravelDays } from "@prisma/client";
import { NextApiRequest, NextApiResponse } from "next";

type Data = {
  success: boolean;
  data?: TimeLineHasTravelDays;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  const prisma = new PrismaClient();

  const {
    query: { id },
    method,
  } = req;

  if (typeof id !== "string") return res.status(400);

  switch (method) {
    case "GET" /* Get a model by its ID */:
      try {
        res.status(200).json({ success: true });
      } catch (error) {
        res.status(400).json({ success: false });
      }
      break;

    case "POST" /* Edit a model by its ID */:
      try {
        const { timeLineId } = req.body;

        const timeLineHasTravelDays = await prisma.timeLineHasTravelDays.create(
          {
            data: {
              timeLineId: +timeLineId,
              travelDayId: +id,
            },
          }
        );

        res.status(200).json({ success: true, data: timeLineHasTravelDays });
      } catch (error) {
        res.status(400).json({ success: false });
      }
      break;

    case "DELETE":
      try {
        const { timeLineId } = req.body;

        await prisma.timeLineHasTravelDays.delete({
          where: {
            timeLineId_travelDayId: {
              timeLineId: +timeLineId,
              travelDayId: +id,
            },
          },
        });

        res.status(200).json({ success: true });
      } catch (error) {
        res.status(400).json({ success: false });
      }
      break;

    default:
      res.status(400).json({ success: false });
      break;
  }
}
