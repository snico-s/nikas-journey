import NextAuth from "next-auth/next";
import GithubProvider from "next-auth/providers/github";
import CredentialsProvider from "next-auth/providers/credentials";
import dbConnect from "../../../lib/dbConnect";
import User from "../../../models/User";
import { compare, hash } from "bcryptjs";

export default NextAuth({
  providers: [
    CredentialsProvider({
      // The name to display on the sign in form (e.g. "Sign in with...")
      name: "Credentials",
      credentials: {
        email: { label: "E-Mail", type: "text", placeholder: "jsmith" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials, req) {
        // await dbConnect();

        // Add logic here to look up the user from the credentials supplied
        // const user = { id: 1, name: "J Smith", email: "jsmith@example.com" };
        try {
          const user: User = await User.findOne({ email: credentials?.email });
          console.log(user);
          if (!user) {
            throw new Error("No user found with the email");
          }

          const checkPassword = await compare(
            credentials?.password as string,
            user.password
          );

          if (!checkPassword) {
            throw new Error("Password doesnt match");
          }

          return user;
        } catch (error) {
          console.log(error);
          return null;
        }
      },
    }),
  ],
});
