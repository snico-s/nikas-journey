import NextAuth, { DefaultSession } from "next-auth";

import { JWT } from "next-auth/jwt";

declare module "next-auth/jwt" {
  /** Returned by the `jwt` callback and `getToken`, when using JWT sessions */
  interface JWT {
    /** OpenID ID Token */
    isAdmin: boolean;
    id: number;
  }
}

declare module "next-auth" {
  /**
   * Returned by `useSession`, `getSession` and received as a prop on the `SessionProvider` React Context
   */
  interface Session {
    user: {
      /** The user's postal address. */
      isAdmin: boolean;
      id: number;
    } & DefaultSession["user"];
  }

  interface User {
    isAdmin: boolean;
    id: number;
  }
}
