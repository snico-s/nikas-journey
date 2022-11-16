import { NextApiRequest, NextApiResponse } from "next";
import { hash } from "bcryptjs";
import { PrismaClient, User } from "@prisma/client";

type Data = {
  message: string;
  data?: User;
};

async function handler(req: NextApiRequest, res: NextApiResponse<Data>) {
  const prisma = new PrismaClient();

  //Only POST mothod is accepted
  if (req.method === "POST") {
    const { email, name, password } = req.body;
    //Validate
    if (!email || !email.includes("@") || !password) {
      res.status(422).json({ message: "Invalid Data" });
      return;
    }
    //Check existing
    const checkExisting = await prisma.user.findUnique({
      where: { email: email },
    });
    //Send error response if duplicate
    if (checkExisting) {
      res.status(422).json({ message: "User already exists" });
      return;
    }
    try {
      const user = await prisma.user.create({
        data: {
          name: name,
          email: email,
          password: await hash(password, 12),
        },
      });

      res.status(201).json({ message: "success", data: user });
      res.status(201).json({ message: "success" });
    } catch (error) {
      res.status(400).json({ message: "failed" });
    }
  } else {
    res.status(400).json({ message: "not allowed" });
  }
}

export default handler;
