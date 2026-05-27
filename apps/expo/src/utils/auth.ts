import type { SecureStoreOptions } from "expo-secure-store";
import * as SecureStore from "expo-secure-store";
import { expoClient } from "@better-auth/expo/client";
import { createAuthClient } from "better-auth/react";

import { getBaseUrl } from "./base-url";
import { posthog } from "./posthog";

const authStorageOptions = {
  keychainAccessible: SecureStore.AFTER_FIRST_UNLOCK,
  keychainService: "probable-pitcher-better-auth",
} satisfies SecureStoreOptions;

const inMemoryAuthStorage = new Map<string, string>();

const isSecureStoreInteractionError = (error: unknown): boolean => {
  const errorMessage = error instanceof Error ? error.message : String(error);

  return (
    errorMessage.includes("User interaction is not allowed") ||
    errorMessage.includes("errSecInteractionNotAllowed")
  );
};

const captureSecureStoreInteractionError = (error: unknown) => {
  posthog.captureException(
    error instanceof Error
      ? error
      : new Error("SecureStore keychain interaction failed", { cause: error }),
  );
};

const authStorage = {
  getItem(key: string): string | null {
    const cachedValue = inMemoryAuthStorage.get(key) ?? null;

    try {
      const value = SecureStore.getItem(key, authStorageOptions);

      if (value !== null) {
        inMemoryAuthStorage.set(key, value);
        return value;
      }
    } catch (error) {
      if (isSecureStoreInteractionError(error)) {
        captureSecureStoreInteractionError(error);
        return cachedValue;
      }

      throw error;
    }

    try {
      const legacyValue = SecureStore.getItem(key);

      if (legacyValue !== null) {
        inMemoryAuthStorage.set(key, legacyValue);

        try {
          SecureStore.setItem(key, legacyValue, authStorageOptions);
          posthog.capture("better_auth_secure_store_migrated", { key });
        } catch (error) {
          if (isSecureStoreInteractionError(error)) {
            captureSecureStoreInteractionError(error);
            return legacyValue;
          }

          throw error;
        }

        return legacyValue;
      }
    } catch (error) {
      if (isSecureStoreInteractionError(error)) {
        captureSecureStoreInteractionError(error);
        return cachedValue;
      }

      throw error;
    }

    inMemoryAuthStorage.delete(key);
    return null;
  },
  setItem(key: string, value: string) {
    inMemoryAuthStorage.set(key, value);

    try {
      SecureStore.setItem(key, value, authStorageOptions);
    } catch (error) {
      if (isSecureStoreInteractionError(error)) {
        captureSecureStoreInteractionError(error);
        return;
      }

      throw error;
    }
  },
};

export const authClient = createAuthClient({
  disableDefaultFetchPlugins: true,
  plugins: [
    expoClient({
      scheme: "probablepitcher",
      storage: authStorage,
    }),
  ],
  baseURL: getBaseUrl(),
});
