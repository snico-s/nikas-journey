import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";

export async function middleware(req: NextRequest) {
  const session = await getToken({ req, secret: process.env.SECRET });

  if (session?.isAdmin) {
    return NextResponse.next();
  }

  return new Response("Auth required", {
    status: 401,
  });
}
