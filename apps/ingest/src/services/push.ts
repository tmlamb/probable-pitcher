import fetch from "node-fetch";
import { z } from "zod";

const pushTicketSchema = z.object({
  data: z.array(
    z.discriminatedUnion("status", [
      z.object({ status: z.literal("ok"), id: z.string() }),
      z.object({
        status: z.literal("error"),
        message: z.string(),
        details: z.object({ error: z.string() }).optional(),
      }),
    ]),
  ),
});

export async function sendPushNotification(
  expoPushToken: string,
  title: string,
  body: string,
) {
  const message = {
    to: expoPushToken,
    sound: "default",
    title,
    body,
    ttl: 86400,
  };

  console.log(`sending push notification to device [token redacted]: ${title}`);

  const res = await fetch(`${process.env.EXPO_API_URL}/--/api/v2/push/send`, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Accept-encoding": "gzip, deflate",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(message),
  });

  if (!res.ok) {
    throw new Error(
      `Expo push API returned HTTP ${res.status}: ${await res.text()}`,
    );
  }

  const parsed = pushTicketSchema.parse(await res.json());

  for (const ticket of parsed.data) {
    if (ticket.status === "error") {
      throw new Error(
        `Expo push ticket error: ${ticket.message} (${ticket.details?.error ?? "unknown"})`,
      );
    }
  }
}
