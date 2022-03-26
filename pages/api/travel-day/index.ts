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
        const route = req.body.route;
        console.log(route);

        let travelDay: Prisma.TravelDayCreateInput;

        travelDay = {
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
                type: route.feature.geometry.type,
                coordinates: route.feature.geometry.coordinates,
                properties: route.feature.properties,
              },
            },
          };
        }

        const createTravelDay = await prisma.travelDay.create({
          data: travelDay,
        });

        res.status(201).json({ success: true, data: createTravelDay });

        // if (Object.keys(route).length === 0) {
        //   const travelDay = await prisma.travelDay.create({
        //     data: {
        //       title: req.body.title,
        //       date: new Date(req.body.date),
        //       body: req.body.body,
        //       distance: req.body.distance,
        //       route: {
        //         create: {
        //           type: route.geometry.type,
        //           coordinates: route.geometry?.coordinates,
        //           properties: route.properties,
        //         },
        //       },
        //     },
        //   });
        //   res.status(201).json({ success: true, data: travelDay });
        // } else {
        //   const travelDay = await prisma.travelDay.create({
        //     data: {
        //       title: req.body.title,
        //       date: new Date(req.body.date),
        //       body: req.body.body,
        //       distance: req.body.distance,
        //     },
        //   });
        //   res.status(201).json({ success: true, data: travelDay });
        // }
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
