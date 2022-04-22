import NextAuth from "next-auth/next";
import GithubProvider from "next-auth/providers/github";
import CredentialsProvider from "next-auth/providers/credentials";
import { compare, hash } from "bcryptjs";
import { PrismaClient } from "@prisma/client";

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
        // Add logic here to look up the user from the credentials supplied
        // const user = { id: 1, name: "J Smith", email: "jsmith@example.com" };
        try {
          const prisma = new PrismaClient();

          const user = await prisma.user.findUnique({
            where: { email: credentials?.email },
          });
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
  callbacks: {
    async jwt({ token, user }) {
      // Persist the OAuth access_token to the token right after signin
      console.log(user);
      console.log("jwt...................................");

      if (user) {
        token.isAdmin = user.isAdmin;
      }
      return token;
    },
    async session({ session, token, user }) {
      console.log(token);
      // Send properties to the client, like an access_token from a provider.
      // session.user.isAdmin = user.isAdmin;
      session.user.isAdmin = token.isAdmin;
      console.log(user);
      console.log("session...................................");
      return session;
    },
  },
});
