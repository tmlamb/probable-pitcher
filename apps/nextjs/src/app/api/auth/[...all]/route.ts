import { toNextJsHandler } from "better-auth/next-js";

import { auth } from "@probable/auth";

export const { GET, POST } = toNextJsHandler(auth.handler);
