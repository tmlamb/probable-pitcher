import { expect, test } from "vitest";
import fetch from "node-fetch";
import { Notification } from "@probable/db/schema";

// See test-data.sql for test data
const TEST_USER_SCENARIOS = [
  {
    sessionId:
      "1c2358f551e04be5ae8e312a6b9888e1.VDtI7sJQHirgwwj2O2q812EYksqph1kG%2FU9m%2F7yNbRM%3D",
    deviceId: "d11186c4-4d5c-4a4e-95c7-fd4c382c111d",
    notifications: [
      {
        gameId: "a111c26a-f3e4-4c48-a132-fd6774cb111a",
        sent: true,
      },
    ],
  },
  {
    sessionId:
      "2c2358f551e04be5ae8e312a6b9888e2.z31FvjT6%2BnS3pVEatYpnj7l8YPqPJdcOlvFzCkCzVLI%3D",
    deviceId: "d2220614-e86b-43e5-a6ea-f4d7816a222d",
    notifications: [
      {
        gameId: "a111c26a-f3e4-4c48-a132-fd6774cb111a",
        sent: true,
      },
      {
        gameId: "a3331f88-3f1a-4492-978b-30770358333a",
        sent: true,
      },
    ],
  },
  {
    sessionId:
      "3c2358f551e04be5ae8e312a6b9888e3.9oG5MFMYg0WWBmMeqauDtIwfwMQuj%2BEJHueuu4XA9no%3D",
    deviceId: "d333ca0c-de64-4e25-9de7-bea768bc333d",
    notifications: [
      {
        gameId: "a2225427-d775-4047-8b3e-e93a68fc222a",
        sent: false,
      },
    ],
  },
  {
    sessionId:
      "3c2358f551e04be5ae8e312a6b9888e3.9oG5MFMYg0WWBmMeqauDtIwfwMQuj%2BEJHueuu4XA9no%3D",
    deviceId: "d3232a0c-de64-4e25-9de7-bea768b2323d",
    notifications: [
      {
        gameId: "a2225427-d775-4047-8b3e-e93a68fc222a",
        sent: false,
      },
    ],
  },
  {
    sessionId:
      "4c2358f551e04be5ae8e312a6b9888e4.dSZIw5Na8kE8GfQVvbfVvwZH%2BzK%2FDyRk7MXoEfAuEQw%3D",
    deviceId: "d444ca0c-de64-4e25-9de7-bea768b8444d",
    notifications: [
      {
        gameId: "a2225427-d775-4047-8b3e-e93a68fc222a",
        sent: true,
      },
    ],
  },
  {
    sessionId:
      "4c2358f551e04be5ae8e312a6b9888e4.dSZIw5Na8kE8GfQVvbfVvwZH%2BzK%2FDyRk7MXoEfAuEQw%3D",
    deviceId: "d4242c0c-de64-4e25-9de7-bea768b2424d",
    notifications: [
      {
        gameId: "a2225427-d775-4047-8b3e-e93a68fc222a",
        sent: false,
      },
    ],
  },
  {
    sessionId:
      "5c2358f551e04be5ae8e312a6b9888e5.1JZocw%2Bhe1urcGTeHrPMwnSB2VjmEnzWM08kyKnhja0%3D",
    deviceId: "d555ca0c-de64-4e25-9de7-bea768bc555d",
    notifications: [
      {
        gameId: "a3331f88-3f1a-4492-978b-30770358333a",
        sent: true,
      },
    ],
  },
  {
    sessionId:
      "5c2358f551e04be5ae8e312a6b9888e5.1JZocw%2Bhe1urcGTeHrPMwnSB2VjmEnzWM08kyKnhja0%3D",
    deviceId: "d5252a0c-de64-4e25-9de7-bea768b2525d",
    notifications: [
      {
        gameId: "a3331f88-3f1a-4492-978b-30770358333a",
        sent: true,
      },
    ],
  },
  {
    sessionId:
      "6c2358f551e04be5ae8e312a6b9888e6.YgmHtdzORXUVrgrKfUwZPkIYMShsPhML4Y9cR9ZGnsc%3D",
    deviceId: "d666ca0c-de64-4e25-9de7-bea768bc666d",
    notifications: [],
  },
  {
    sessionId:
      "7c2358f551e04be5ae8e312a6b9888e7.vTwAArqdkKQqMhxFlz%2FCEARpRw04VDTO8a9a7d7ehIU%3D",
    deviceId: "d777aa0c-de64-4e25-9de7-bea768ba777d",
    notifications: [
      {
        gameId: "a5551f88-3f1a-4492-978b-30770358555a",
        sent: true,
      },
    ],
  },
] as const;

async function getNotifications(sessionId: string, deviceId: string) {
  const url = new URL(
    `${process.env.VITE_API_URL}/api/trpc/notification.byDeviceId`,
  );

  url.searchParams.append("batch", "1");
  url.searchParams.append("input", `{"0":{"json":{"deviceId":"${deviceId}"}}}`);

  return fetch(url.toString(), {
    headers: {
      "Content-Type": "application/json",
      cookie: `probable-pitcher.session-token=${sessionId}`,
    },
  })
    .then((r) => r.json())
    .then(
      (json) =>
        (
          JSON.parse(JSON.stringify(json)) as {
            result?: { data: { json: Notification[] } };
          }[]
        )[0]?.result?.data.json,
    );
}

test("Users recieve expected notifications", async () => {
  for (const user of TEST_USER_SCENARIOS) {
    const { sessionId, deviceId, notifications: notificationsExpected } = user;
    const notificationsRecieved = await getNotifications(sessionId, deviceId);

    expect(
      notificationsRecieved,
      `No notification data for user session ${sessionId} with device ${deviceId}`,
    ).not.toBeUndefined();

    expect(
      notificationsRecieved?.length,
      `Number of recieved notifications (${notificationsRecieved?.length}) doesn't match number of expected notifications (${notificationsExpected.length}) for user session ${sessionId} with device ${deviceId}`,
    ).toBe(notificationsExpected.length);
    notificationsRecieved?.forEach((recieved) => {
      expect(
        notificationsExpected.some(
          (expected) =>
            expected.gameId === recieved.gameId &&
            expected.sent === !!recieved.sentOn,
        ),
        `Recieved notification not matched for user session ${sessionId} with device ${deviceId}. Expected: ${JSON.stringify(
          notificationsExpected,
        )}, Recieved: ${JSON.stringify(recieved)}`,
      ).toBe(true);
    });
  }
});
