import NextAuth from "next-auth/next";
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
          console.log("authorize");
          const prisma = new PrismaClient();

          const user = await prisma.user.findUnique({
            where: { email: credentials?.email },
          });
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
          return null;
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      // Persist the OAuth access_token to the token right after signin
      if (user) {
        token.isAdmin = user.isAdmin;
        token.id = +user.id;
      }
      return token;
    },
    async session({ session, token, user }) {
      // Send properties to the client, like an access_token from a provider.
      session.user.isAdmin = token.isAdmin;
      session.user.id = token.id;
      return session;
    },
  },
});
