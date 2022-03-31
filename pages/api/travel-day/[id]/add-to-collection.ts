import { CollectionDays, PrismaClient, Route } from "@prisma/client";
import { NextApiRequest, NextApiResponse } from "next";

type Data = {
  success: boolean;
  data?: CollectionDays;
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

  console.log(method);
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
        console.log("add-to-collection");
        const { routeCollectionId } = req.body;
        console.log(routeCollectionId);

        const collectionDays = await prisma.collectionDays.create({
          data: {
            routeCollectionId: +routeCollectionId,
            travelDayId: +id,
          },
        });

        res.status(200).json({ success: true, data: collectionDays });
      } catch (error) {
        console.log(error);
        res.status(400).json({ success: false });
      }
      break;

    case "DELETE":
      try {
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
