import fetch from "node-fetch";
import { z } from "zod";

const pushTicket = z.discriminatedUnion("status", [
  z.object({ status: z.literal("ok"), id: z.string() }),
  z.object({
    status: z.literal("error"),
    message: z.string(),
    details: z.object({ error: z.string() }).optional(),
  }),
]);

// Expo returns { data: ticket } for a single message, or { data: ticket[] } for a batch
const pushTicketSchema = z.object({
  data: z.union([z.array(pushTicket), pushTicket]),
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
  const tickets = Array.isArray(parsed.data) ? parsed.data : [parsed.data];

  for (const ticket of tickets) {
    if (ticket.status === "error") {
      throw new Error(
        `Expo push ticket error: ${ticket.message} (${ticket.details?.error ?? "unknown"})`,
      );
    }
  }
}
