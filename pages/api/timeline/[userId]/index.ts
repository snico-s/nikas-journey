import { NextApiRequest, NextApiResponse } from "next";
import prisma from "../../../../lib/prisma";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { method } = req;
  const { userId } = req.query;

  switch (method) {
    case "GET":
      if (!userId) return res.status(400).json({ error: "No userId" });
      try {
        const timeLine = await prisma.timeLine.findMany({
          where: {
            userId: Number(userId),
          },
        });

        res.status(200).json(timeLine);
      } catch (error) {
        res.status(400).json({ success: false, error });
      }
      break;
  }
}
