import { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient, TravelDay } from "@prisma/client";
import { unstable_getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]";

const prisma = new PrismaClient();

type Data = {
  success: boolean;
  data?: TravelDay[] | TravelDay;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  switch (req.method) {
    case "GET":
      try {
        const routes = await prisma.travelDay.findMany({
          include: {
            timeLineTravelDays: {
              include: {
                timeLine: true,
              },
            },
          },
        });
        res.status(200).json(routes);
      } catch (error) {
        res.status(400).json({ success: false });
      }
      break;

    case "POST":
      try {
        const route = req.body.route;
        const simplifiedCoordinates = req.body.simplifiedCoordinates;
        let travelDayId: number | null = null;

        const session = await unstable_getServerSession(req, res, authOptions);
        if (!session) return res.status(400).json({ msg: "No Session" });
        const userId = session.user.id;

        //check if date exists
        let existingTravelDay = await prisma.travelDay.findMany({
          where: {
            date: new Date(req.body.date),
            userId: userId,
          },
        });

        if (existingTravelDay.length > 0) {
          travelDayId = existingTravelDay[0].id;

          if (Object.keys(route).length > 0) {
            await prisma.route.create({
              data: {
                type: route.geometry.type,
                coordinates: route.geometry.coordinates,
                simplifiedCoordinates: simplifiedCoordinates,
                properties: route.properties,
                travelDayId: travelDayId,
                createdBy: userId,
              },
            });
          }
        } else {
          if (!userId) return res.status(400).json({ success: false });

          // let travelDay = {
          //   title: req.body.title,
          //   date: new Date(req.body.date),
          //   body: req.body.body,
          //   distance: req.body.distance,
          //   userId: userId,
          // };

          if (Object.keys(route).length > 0) {
            //   travelDay = {
            //     ...travelDay,
            //     route: {
            //       create: {
            //         type: route.geometry.type,
            //         coordinates: route.geometry.coordinates,
            //         simplifiedCoordinates: simplifiedCoordinates,
            //         properties: route.properties,
            //       },
            //     },
            //   };

            const createTravelDay = await prisma.travelDay.create({
              data: {
                title: req.body.title,
                date: new Date(req.body.date),
                body: req.body.body,
                distance: req.body.distance,
                userId: userId,
                route: {
                  create: {
                    type: route.geometry.type,
                    coordinates: route.geometry.coordinates,
                    simplifiedCoordinates: simplifiedCoordinates,
                    properties: route.properties,
                  },
                },
              },
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
