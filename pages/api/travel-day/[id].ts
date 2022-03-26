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

  switch (method) {
    case "GET" /* Get a model by its ID */:
      try {
        console.log(id);
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

    case "PUT" /* Edit a model by its ID */:
      try {
        const travelDay = await prisma.travelDay.update({
          where: {
            id: +id,
          },
          data: {
            title: req.body.title,
            date: new Date(req.body.date),
            body: req.body.body,
            distance: req.body.distance,
            payments: req.body.payments,
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

    case "DELETE" /* Delete a model by its ID */:
      try {
        const travelDay = await prisma.travelDay.delete({
          where: { id: +id },
        });
        if (!travelDay) {
          return res.status(400).json({ success: false });
        }
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
