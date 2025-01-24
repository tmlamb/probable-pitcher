import { Auth } from "@auth/core";
import Google from "@auth/core/providers/google";
import Apple from "@auth/core/providers/apple";
import { eventHandler, toWebRequest } from "h3";

export default eventHandler(async (event) =>
  Auth(toWebRequest(event), {
    basePath: "/r",
    secret: process.env.AUTH_SECRET,
    redirectProxyUrl: process.env.AUTH_REDIRECT_PROXY_URL,
    debug: true,
    cookies: {
      pkceCodeVerifier: {
        name: "next-auth.pkce.code_verifier",
        options: {
          httpOnly: true,
          sameSite: "none",
          path: "/",
          secure: true,
        },
      },
    },
    providers: [
      Google({
        clientId: process.env.AUTH_GOOGLE_ID,
        clientSecret: process.env.AUTH_GOOGLE_SECRET,
      }),
      Apple({
        clientId: process.env.AUTH_APPLE_ID,
        clientSecret: process.env.AUTH_APPLE_SECRET ?? "uh-oh",
        wellKnown: "https://appleid.apple.com/.well-known/openid-configuration",
        checks: ["pkce"],
        token: {
          url: `https://appleid.apple.com/auth/token`,
        },
        authorization: {
          url: "https://appleid.apple.com/auth/authorize",
          params: {
            scope: "",
            response_type: "code",
            response_mode: "query",
            state: crypto.randomUUID(),
          },
        },
        client: {
          token_endpoint_auth_method: "client_secret_post",
        },
      }),
    ],
    trustHost: true,
  }),
);
