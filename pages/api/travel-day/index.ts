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
        res.status(200).json({ success: false, data: routes });
      } catch (error) {
        res.status(400).json({ success: false });
      }
      break;
    case "POST":
      try {
        // const route: GeoJSON.Feature<LineString> = req.body.route;
        let travelDay: Prisma.TravelDayCreateInput = {
          title: req.body.title,
          date: new Date(req.body.date),
          body: req.body.body,
          distance: req.body.distance,
        };

        const route = req.body.route;
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
        }

        const createTravelDay = await prisma.travelDay.create({
          data: travelDay,
        });

        // const timeline = await prisma.timeLine.update({
        //   where: {
        //     userId_name: {
        //       name: "main",
        //       userId: 1,
        //     },
        //   },
        //   data: {
        //     timeLineHasTravelDays: {
        //       create: {
        //         travelDayId: createTravelDay.id,
        //       },
        //     },
        //   },
        // });

        res.status(201).json({ success: true, data: createTravelDay });
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
