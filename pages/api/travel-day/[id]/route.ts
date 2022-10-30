import { PrismaClient, Route } from "@prisma/client";
import { NextApiRequest, NextApiResponse } from "next";

type Data = {
  success: boolean;
  data?: Route[] | Route;
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
        res.status(200).json({ success: true });
      } catch (error) {
        res.status(400).json({ success: false });
      }
      break;

    case "POST" /* Edit a model by its ID */:
      try {
        const { route } = req.body;

        const routeCreate = await prisma.route.create({
          data: {
            travelDayId: +id,
            type: route.geometry.type,
            coordinates: route.geometry.coordinates,
            properties: route.properties,
          },
        });

        res.status(200).json({ success: true, data: routeCreate });
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

export const config = {
  api: {
    bodyParser: {
      sizeLimit: "10mb", // Set desired value here
    },
  },
};
