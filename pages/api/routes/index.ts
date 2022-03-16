import { NextApiRequest, NextApiResponse } from "next";
import dbConnect from "../../../lib/dbConnect";
import Route from "../../../models/Route";

type routeData = {
  date: string;
  title: string;
  text: string;
  outgoings: number;
  distance: number;
};

type Data = {
  success: boolean;
  data?: routeData | Array<routeData>;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  const { method } = req;

  await dbConnect();

  switch (method) {
    case "GET":
      try {
        const routes: Array<routeData> = await Route.find({});
        res.status(200).json({ success: false, data: routes });
      } catch (error) {
        res.status(400).json({ success: false });
      }
      break;
    case "POST":
      try {
        console.log(req.body);
        const route: routeData = await Route.create(
          req.body
        ); /* create a new model in the database */
        res.status(201).json({ success: true, data: route });
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
