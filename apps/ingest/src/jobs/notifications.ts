import { add, endOfToday, format } from "date-fns";
import { DrizzleError } from "drizzle-orm";
import { formatInTimeZone } from "date-fns-tz";
import { client } from "../db/client.js";
import { sendPushNotification } from "../services/push.js";

const TIME_FORMAT = "h:mm aaa z";

export async function ingestNotifications() {
  const todayStart = new Date();
  const todayEnd = add(endOfToday(), { hours: 6 });

  console.log("Ingesting notifications for today:", todayStart, todayEnd);
  const gamesToday = await client.game.inRange(todayStart, todayEnd);
  console.debug("Found games today:", JSON.stringify(gamesToday));
  for (const game of gamesToday) {
    const pitchers = [game.homePitcher, game.awayPitcher].filter(
      (pitcher) => !!pitcher,
    );

    for (const pitcher of pitchers) {
      const subscriptions = await client.subscription.byPitcherId(pitcher.id);
      for (const subscription of subscriptions) {
        for (const device of subscription.user.devices) {
          try {
            await client.notification.create({
              deviceId: device.id,
              gameId: game.id,
              pitcherId: pitcher.id,
            });
          } catch (e) {
            if (
              e instanceof DrizzleError &&
              e.message.includes("23505") // unique constraint violation, notification already ingested
            ) {
              console.warn("Duplicate notifications cannot be created: ", e);
            } else {
              console.error(
                "Unknown error ingesting notifications for subscription: ",
                e,
              );
            }
            continue;
          }
        }
      }
    }
  }
}

export async function sendNotifications() {
  const todayStart = new Date();
  const hour = Number(format(todayStart, "H"));
  const todayEnd = add(hour < 6 ? todayStart : endOfToday(), { hours: 6 });

  console.log("Getting notifications for today:", todayStart, todayEnd);
  const devicesWithNotifications =
    await client.device.withPendingNotificationsInRange(todayStart, todayEnd);

  console.debug(
    `Found ${
      devicesWithNotifications.length
    } devices with notifications: ${JSON.stringify(devicesWithNotifications)}`,
  );

  for (const device of devicesWithNotifications) {
    const localHour = Number(
      formatInTimeZone(Date.now(), device.timezone, "H"),
    );
    if (localHour < 9 || localHour >= 21) {
      console.debug(
        `User device ${device.id} skipped alert because ${localHour} is in quiet hours for the timezone '${device.timezone}'.`,
      );
      continue;
    }
    console.debug(
      `User device ${device.id} sent alert because ${localHour} is in working hours for the timezone '${device.timezone}'.`,
    );

    console.debug(
      `Device ${device.id} has ${
        device.notifications.length
      } notifications: ${JSON.stringify(device.notifications)}`,
    );

    const fulfilled = new Set<string>();
    const messages: string[] = [];

    for (const notification of device.notifications) {
      const localizedGameTime = formatInTimeZone(
        notification.game.date,
        device.timezone,
        TIME_FORMAT,
      );

      messages.push(`${notification.pitcher.name} @ ${localizedGameTime}`);
      fulfilled.add(notification.id);
    }

    try {
      await sendPushNotification(
        device.pushToken,
        `Probable Pitcher${messages.length > 1 ? "s" : ""}`,
        messages.join("\n"),
      );
    } catch (e) {
      console.error(
        `Error sending push notification to ${device.pushToken} for device: ${device.id}`,
        e,
      );
      continue;
    }

    for (const id of fulfilled) {
      try {
        await client.notification.update(id, new Date());
      } catch (e) {
        console.error(
          `Error marking notification ${id} for device ${device.id} as completed`,
          e,
        );
        continue;
      }
    }
  }
}
