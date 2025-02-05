import { createAuthClient } from "better-auth/react";
import { expoClient } from "@better-auth/expo/client";
import * as SecureStore from "expo-secure-store";
import { getBaseUrl } from "./base-url";
import { api } from "./api";

export const authClient = createAuthClient({
  plugins: [
    expoClient({
      scheme: "probablepitcher",
      storagePrefix: "probablepitcher",
      storage: SecureStore,
    }),
  ],
  baseURL: getBaseUrl(),
});

export const { signIn, signOut, useSession } = authClient;

export const useUser = () => {
  const { data: session } = api.auth.getSession.useQuery();
  return session?.user ?? null;
};
