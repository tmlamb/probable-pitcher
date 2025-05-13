import { cache } from "react";
import { headers } from "next/headers";

import { auth } from "./auth";

export const getSession = async () =>
  cache(auth.api.getSession)({
    headers: await headers(),
  });

export * from "./auth";
//TODO cleanup some of these deletable files in auth, like this one
