import { client } from "../db/client.js";
import {
  legacyAccounts,
  legacyDevices,
  legacySubscriptions,
  legacyUsers,
} from "../migration-data.js";

export async function ingestMigrationData() {
  console.debug("Migrating Users: ", legacyUsers);
  for (const legacyUser of legacyUsers) {
    try {
      await client.user.migrate({
        id: legacyUser.id,
        name: legacyUser.email,
        email: legacyUser.email,
        emailVerified: !!legacyUser.emailVerified.length,
        image: legacyUser.image,
        createdAt: new Date(),
        updatedAt: new Date(),
      });
    } catch (error) {
      console.error("Error migrating user: ", legacyUser, error);
    }
    console.debug("Migrated User: ", legacyUser);
  }

  console.debug("Migrating Accounts: ", legacyAccounts);
  for (const legacyAccount of legacyAccounts) {
    try {
      await client.account.migrate({
        id: legacyAccount.id,
        accountId: legacyAccount.providerAccountId,
        providerId: legacyAccount.provider.includes("pple")
          ? "apple"
          : "google",
        userId: legacyAccount.userId,
        accessToken: legacyAccount.access_token,
        refreshToken: legacyAccount.refresh_token,
        idToken: legacyAccount.id_token,
        accessTokenExpiresAt: new Date(Number(legacyAccount.expires_at)),
        refreshTokenExpiresAt: null,
        scope: legacyAccount.scope,
        password: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      });
    } catch (error) {
      console.error("Error migrating account: ", legacyAccount, error);
    }
    console.debug("Migrated Account: ", legacyAccount);
  }

  console.debug("Migrating Devices: ", legacyDevices);
  for (const legacyDevice of legacyDevices) {
    try {
      await client.device.migrate({
        userId: legacyDevice.userId,
        pushToken: legacyDevice.pushToken,
        timezone: legacyDevice.timezone,
        notificationsEnabled: legacyDevice.notificationsEnabled === "1",
      });
    } catch (error) {
      console.error("Error migrating device: ", legacyDevice, error);
    }
    console.debug("Migrated Device: ", legacyDevice);
  }

  console.debug("Migrating Subscriptions: ", legacySubscriptions);
  for (const legacySubscription of legacySubscriptions) {
    try {
      const newPitcher = await client.pitcher.byRef(
        Number(legacySubscription.pitcherId),
      );
      if (!newPitcher) {
        console.warn(
          `Missing pitcher for subscription when processing: ${JSON.stringify(
            legacySubscription,
          )}`,
        );
        continue;
      }
      await client.subscription.migrate({
        userId: legacySubscription.userId,
        pitcherId: newPitcher.id,
      });
    } catch (error) {
      console.error(
        "Error migrating subscription: ",
        legacySubscription,
        error,
      );
    }
    console.debug("Migrated Subscription: ", legacySubscription);
  }
}
