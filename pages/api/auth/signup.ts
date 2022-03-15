import { NextApiRequest, NextApiResponse } from "next";
import { hash } from "bcryptjs";
import dbConnect from "../../../lib/dbConnect";
import User from "../../../models/User";

type Data = {
  message: string;
  data?: User;
};

async function handler(req: NextApiRequest, res: NextApiResponse<Data>) {
  await dbConnect();

  //Only POST mothod is accepted
  if (req.method === "POST") {
    const { email, password } = req.body;
    //Validate
    if (!email || !email.includes("@") || !password) {
      res.status(422).json({ message: "Invalid Data" });
      return;
    }
    //Check existing
    const checkExisting = await User.findOne({ email: email });
    //Send error response if duplicate
    if (checkExisting) {
      res.status(422).json({ message: "User already exists" });
      return;
    }
    try {
      const user: User = await User.create({
        email,
        password: await hash(password, 12),
      });

      res.status(201).json({ message: "success", data: user });
      res.status(201).json({ message: "success" });
    } catch (error) {
      console.log(error);
      res.status(400).json({ message: "failed" });
    }
  }
}

export default handler;
