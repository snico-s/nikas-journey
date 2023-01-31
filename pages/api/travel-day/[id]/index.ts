import { PrismaClient, TravelDay } from "@prisma/client";
import { NextApiRequest, NextApiResponse } from "next";

type Data = {
  success: boolean;
  data?: TravelDay[] | TravelDay;
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

  if (typeof id !== "string") return res.status(400).json({ success: false });

  switch (method) {
    case "GET":
      try {
        const travelDay = await prisma.travelDay.findMany({
          where: {
            id: +id,
          },
        });
        if (!travelDay) {
          return res.status(400).json({ success: false });
        }
        res.status(200).json({ success: true, data: travelDay });
      } catch (error) {
        res.status(400).json({ success: false });
      }
      break;

    case "PUT":
      try {
        const { date, title, body, distance } = req.body.travelDay;
        const travelDay = await prisma.travelDay.update({
          where: {
            id: +id,
          },
          data: {
            title: title,
            date: new Date(date),
            body: body,
            distance: distance,
          },
        });

        res.status(200).json({ success: true, data: travelDay });
      } catch (error) {
        res.status(400).json({ success: false });
      }
      break;

    case "DELETE" /* Delete a model by its ID */:
      console.log("/api/travel-day/", id, " DELETE");
      try {
        const timeLine = await prisma.timeLineHasTravelDays.deleteMany({
          where: { travelDayId: +id },
        });
        const travelDay = await prisma.travelDay.delete({
          where: { id: +id },
        });
        console.log({ travelDay, timeLine });
        if (!travelDay) {
          return res.status(400).json({ success: false });
        }
        res.status(200).json({ success: true });
      } catch (error) {
        console.log(error);
        res.status(400).json({ success: false });
      }
      break;

    default:
      res.status(400).json({ success: false });
      break;
  }
}

export const config = {
  api: {
    bodyParser: {
      sizeLimit: "10mb", // Set desired value here
    },
  },
};
