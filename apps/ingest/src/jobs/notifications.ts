import { add, endOfDay, format } from "date-fns";
import { formatInTimeZone } from "date-fns-tz";

import { client } from "../db/client.js";
import { sendPushNotification } from "../services/push.js";

const TIME_FORMAT = "h:mm aaa z";

export async function ingestNotifications(ingestStartTime: Date) {
  const ingestEndTime = add(endOfDay(ingestStartTime), { hours: 6 });

  console.log(
    "Ingesting notifications for today:",
    ingestStartTime,
    ingestEndTime,
  );
  const gamesToday = await client.game.inRange(ingestStartTime, ingestEndTime);
  console.debug("Found games today:", JSON.stringify(gamesToday));
  for (const game of gamesToday) {
    console.debug("Ingesting notifications for game:", game.id);
    const pitchers = [game.homePitcher, game.awayPitcher].filter(
      (pitcher) => !!pitcher,
    );
    console.debug("Found pitchers for game:", JSON.stringify(pitchers));
    for (const pitcher of pitchers) {
      console.debug("Ingesting notifications for pitcher:", pitcher.id);
      const subscriptions = await client.subscription.byPitcherId(pitcher.id);
      console.debug(
        `Found ${subscriptions.length} subscriptions for pitcher: ${JSON.stringify(
          subscriptions,
        )}`,
      );
      for (const subscription of subscriptions) {
        console.debug(
          `Ingesting notifications for subscription: ${JSON.stringify(
            subscription,
          )}`,
        );
        for (const device of subscription.user.devices) {
          console.debug(
            `Ingesting notifications for device: ${JSON.stringify(device)}`,
          );
          try {
            await client.notification.create({
              deviceId: device.id,
              gameId: game.id,
              pitcherId: pitcher.id,
            });
          } catch (e) {
            if (
              e instanceof Error
              //e instanceof QueryError &&
              //e.code === "23505" // unique constraint violation, notification already ingested
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

export async function sendNotifications(sendStartTime: Date) {
  const hour = Number(format(sendStartTime, "H"));
  const sendEndTime = add(hour < 6 ? sendStartTime : endOfDay(sendStartTime), {
    hours: 6,
  });

  console.log("Getting notifications for today:", sendStartTime, sendEndTime);
  const devicesWithNotifications =
    await client.device.withPendingNotificationsInRange(
      sendStartTime,
      sendEndTime,
    );

  console.debug(
    `Found ${
      devicesWithNotifications.length
    } devices with notifications: ${JSON.stringify(devicesWithNotifications)}`,
  );

  for (const device of devicesWithNotifications) {
    console.debug(
      `Sending notifications for device: ${JSON.stringify(device)}`,
    );
    const localHour = Number(
      formatInTimeZone(sendStartTime.getTime(), device.timezone, "H"),
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

    // TODO: Push notifications in ascending order of game time (cases seen where they are sent with later game time first)
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
