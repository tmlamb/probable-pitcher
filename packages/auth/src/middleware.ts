import { createAuthClient } from "better-auth/client";
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

export const client = createAuthClient();

export async function authMiddleware(request: NextRequest) {
  const { data: session } = await client.getSession({
    fetchOptions: {
      headers: {
        cookie: request.headers.get("cookie") ?? "",
      },
    },
  });
  if (!session) {
    NextResponse.redirect(new URL("/sign-in", request.url));
  }
  return NextResponse.next();
}
