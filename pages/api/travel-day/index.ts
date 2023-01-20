import { NextApiRequest, NextApiResponse } from "next";

import { Prisma, PrismaClient, TravelDay } from "@prisma/client";
// import { LineString } from "geojson";

const prisma = new PrismaClient();

type Data = {
  success: boolean;
  data?: TravelDay[] | TravelDay;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  switch (req.method) {
    case "GET":
      try {
        const routes = await prisma.travelDay.findMany({
          include: {
            route: true,
          },
        });
        res.status(200).json({ success: true, data: routes });
      } catch (error) {
        res.status(400).json({ success: false });
      }
      break;

    case "POST":
      try {
        const route = req.body.route;
        let travelDayId: number | null = null;

        //check if date exists
        let existingTravelDay = await prisma.travelDay.findUnique({
          where: {
            date: new Date(req.body.date),
          },
        });

        console.log(existingTravelDay);

        if (existingTravelDay !== null) {
          travelDayId = existingTravelDay.id;

          if (Object.keys(route).length > 0) {
            await prisma.route.create({
              data: {
                type: route.geometry.type,
                coordinates: route.geometry.coordinates,
                properties: route.properties,
                travelDayId: travelDayId,
              },
            });
          }
        } else {
          let travelDay: Prisma.TravelDayCreateInput = {
            title: req.body.title,
            date: new Date(req.body.date),
            body: req.body.body,
            distance: req.body.distance,
          };

          if (Object.keys(route).length > 0) {
            travelDay = {
              ...travelDay,
              route: {
                create: {
                  type: route.geometry.type,
                  coordinates: route.geometry.coordinates,
                  properties: route.properties,
                },
              },
            };

            const createTravelDay = await prisma.travelDay.create({
              data: travelDay,
            });

            travelDayId = createTravelDay.id;
          }
        }

        if (travelDayId !== null) {
          await prisma.timeLineHasTravelDays.upsert({
            where: {
              timeLineId_travelDayId: {
                timeLineId: 1,
                travelDayId: travelDayId,
              },
            },
            update: {},
            create: { timeLineId: 1, travelDayId: travelDayId },
          });
        }

        res.status(201).json({ success: true });
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
