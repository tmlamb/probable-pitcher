import { createAuthClient } from "better-auth/react";
import { expoClient } from "@better-auth/expo/client";
import * as SecureStore from "expo-secure-store";
import { getBaseUrl } from "./base-url";

export const authClient = createAuthClient({
  plugins: [
    expoClient({
      scheme: "probablepitcher",
      storage: SecureStore,
    }),
  ],
  baseURL: getBaseUrl(),
});
