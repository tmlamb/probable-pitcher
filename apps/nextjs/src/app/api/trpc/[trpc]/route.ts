import type { NextRequest } from "next/server";
import { fetchRequestHandler } from "@trpc/server/adapters/fetch";

import { appRouter, createTRPCContext } from "@probable/api";

import { auth } from "~/auth/server";

/**
 * Configure basic CORS headers
 * You should extend this to match your needs
 */
const setCorsHeaders = (req: Request, res: Response) => {
  const origin = req.headers.get("origin");
  const userAgent = req.headers.get("user-agent") ?? "";

  if (userAgent.includes("Mozilla") && origin) {
    const allowedOrigins = [
      "https://probablepitcher.com",
      "https://dev.probablepitcher.com",
      "http://localhost:3000", // for development
    ];

    if (allowedOrigins.includes(origin)) {
      res.headers.set("Access-Control-Allow-Origin", origin);
      res.headers.set("Access-Control-Allow-Credentials", "true");
      res.headers.set("Access-Control-Allow-Methods", "OPTIONS, GET, POST");
      res.headers.set(
        "Access-Control-Allow-Headers",
        "content-type, authorization",
      );
    }
  }
};

export const OPTIONS = (req: NextRequest) => {
  const response = new Response(null, {
    status: 204,
  });
  setCorsHeaders(req, response);
  return response;
};

const handler = async (req: NextRequest) => {
  const response = await fetchRequestHandler({
    endpoint: "/api/trpc",
    router: appRouter,
    req,
    createContext: () =>
      createTRPCContext({
        auth,
        headers: req.headers,
      }),
    onError({ error, path }) {
      console.error(`>>> tRPC Error on '${path}'`, error);
    },
  });

  setCorsHeaders(req, response);
  return response;
};

export { handler as GET, handler as POST };
