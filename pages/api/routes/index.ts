import { NextApiRequest, NextApiResponse } from "next";

import { PrismaClient, TravelDay } from "@prisma/client";

const prisma = new PrismaClient();

type routeData = {
  date: string;
  title: string;
  text: string;
  outgoings: number;
  distance: number;
};

type Data = {
  success: boolean;
  // data?: routeData | Array<routeData>;
  data?: TravelDay[] | TravelDay;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  const { method } = req;

  switch (method) {
    case "GET":
      try {
        const routes = await prisma.travelDay.findMany();
        res.status(200).json({ success: false, data: routes });
      } catch (error) {
        res.status(400).json({ success: false });
      }
      break;
    case "POST":
      try {
        const route = await prisma.travelDay.create({
          data: {
            title: "Hallo",
            date: new Date(),
            body: "Hallo",
          },
        });

        res.status(201).json({ success: true, data: route });
      } catch (error) {
        res.status(400).json({ success: false });
      }
      break;
    default:
      res.status(400).json({ success: false });
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
