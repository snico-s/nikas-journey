import { Currency } from "@prisma/client";
import prisma from "../../../lib/prisma";
import type { NextApiRequest, NextApiResponse } from "next";

type Data = {
  success: boolean;
  data?: Currency | Currency[];
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  switch (req.method) {
    case "GET":
      try {
        const payments = await prisma.currency.findMany();
        res.status(200).json({ success: true, data: payments });
      } catch (error) {
        res.status(400).json({ success: false });
      }
      break;
    case "POST":
      try {
      } catch (error) {
        res.status(400).json({ success: false });
      }
    default:
      res.status(400).json({ success: false });
      break;
  }
}
