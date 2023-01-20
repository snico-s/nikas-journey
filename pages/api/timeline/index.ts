import { NextApiRequest, NextApiResponse } from "next";

import {
  PrismaClient,
  Route,
  TimeLine,
  TimeLineHasTravelDays,
  TravelDay,
} from "@prisma/client";

const prisma = new PrismaClient();

type Data = {
  success: boolean;
  data?:
    | (TimeLine & {
        timeLineHasTravelDays: (TimeLineHasTravelDays & {
          travelDays: TravelDay & {
            route: Route[];
          };
        })[];
      })
    | null;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
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
                    route: true,
                  },
                },
              },
            },
          },
        });
        res.status(200).json({ success: true, data: data });
      } catch (error) {
        res.status(400).json({ success: false });
      }
      break;
  }
}
// export default async function handler(
//   req: NextApiRequest,
//   res: NextApiResponse<Data>
// ) {
//   const { method } = req;

//   switch (method) {
//     case "GET":
//       try {
//         const routes: Array<routeData> = await Route.find({});
//         res.status(200).json({ success: false, data: routes });
//       } catch (error) {
//         res.status(400).json({ success: false });
//       }
//       break;
//     case "POST":
//       try {
//         console.log(typeof req.body);
//         const id = new mongoose.Types.ObjectId();
//         req.body.route.id = id;
//         req.body._id = id;
//         console.log(req.body);
//         const route: routeData = await Route.create(req.body);
//         res.status(201).json({ success: true, data: route });
//       } catch (error) {
//         console.log(error);
//         res.status(400).json({ success: false });
//       }
//       break;
//     default:
//       res.status(400).json({ success: false });
//       break;
//   }
// }

export const config = {
  api: {
    bodyParser: {
      sizeLimit: "10mb", // Set desired value here
    },
  },
};
