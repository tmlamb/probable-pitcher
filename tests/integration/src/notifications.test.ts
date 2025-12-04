import fetch from "node-fetch";
import { expect, test } from "vitest";

import { Notification } from "@probable/db/schema";

// See test-data.sql for test data
const TEST_USER_SCENARIOS = [
  {
    apiKey: "SUcKsKtkjdHvacmZpoGZvHhdrESeDlyhWazfdLXEIxPcAqzUzixYWpJedVppGVBf",
    deviceId: "d11186c4-4d5c-4a4e-95c7-fd4c382c111d",
    notifications: [
      {
        gameId: "a111c26a-f3e4-4c48-a132-fd6774cb111a",
        sent: true,
      },
      {
        gameId: "a6661f88-3f1a-4492-978b-30770358666a",
        sent: "2022-08-13 14:00:01.256Z",
      },
    ],
  },
  {
    apiKey: "OelGKPLTcfHGiTXwmxGKWQpGiIquYYusCRiadsxGXyzUZqwdKrAnZfiQvdYnprvT",
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
    apiKey: "JticXhOaPYRgpJyOMRDnLceeqOZDmjoZtUnyvMbFiLsCIenRXWHbExcBKuhSZLUB",
    deviceId: "d333ca0c-de64-4e25-9de7-bea768bc333d",
    notifications: [
      {
        gameId: "a2225427-d775-4047-8b3e-e93a68fc222a",
        sent: false,
      },
    ],
  },
  {
    apiKey: "JticXhOaPYRgpJyOMRDnLceeqOZDmjoZtUnyvMbFiLsCIenRXWHbExcBKuhSZLUB",
    deviceId: "d3232a0c-de64-4e25-9de7-bea768b2323d",
    notifications: [
      {
        gameId: "a2225427-d775-4047-8b3e-e93a68fc222a",
        sent: false,
      },
    ],
  },
  {
    apiKey: "FJrjqYWUBJsQEvopCRUDnNucuLzcbCurYJWLSMmHeWlNkMWUpiBXICSVZRoZMdpQ",
    deviceId: "d444ca0c-de64-4e25-9de7-bea768b8444d",
    notifications: [
      {
        gameId: "a2225427-d775-4047-8b3e-e93a68fc222a",
        sent: true,
      },
      {
        gameId: "a6661f88-3f1a-4492-978b-30770358666a",
        sent: null,
      },
    ],
  },
  {
    apiKey: "FJrjqYWUBJsQEvopCRUDnNucuLzcbCurYJWLSMmHeWlNkMWUpiBXICSVZRoZMdpQ",
    deviceId: "d4242c0c-de64-4e25-9de7-bea768b2424d",
    notifications: [
      {
        gameId: "a2225427-d775-4047-8b3e-e93a68fc222a",
        sent: false,
      },
    ],
  },
  {
    apiKey: "OomxVTCQqNekDIrDpCTScivuDSYRKcDgMOlDlXsEWjtxmEzjNIotYNXHILwmckxd",
    deviceId: "d555ca0c-de64-4e25-9de7-bea768bc555d",
    notifications: [
      {
        gameId: "a3331f88-3f1a-4492-978b-30770358333a",
        sent: true,
      },
    ],
  },
  {
    apiKey: "OomxVTCQqNekDIrDpCTScivuDSYRKcDgMOlDlXsEWjtxmEzjNIotYNXHILwmckxd",
    deviceId: "d5252a0c-de64-4e25-9de7-bea768b2525d",
    notifications: [
      {
        gameId: "a3331f88-3f1a-4492-978b-30770358333a",
        sent: true,
      },
    ],
  },
  {
    apiKey: "tMsazNsBGVmvdukrbiwhGtVtKUpQxgXgNHQdcDMAHRIvbbMFfrgAsGyhdTicHdjS",
    deviceId: "d666ca0c-de64-4e25-9de7-bea768bc666d",
    notifications: [],
  },
  {
    apiKey: "mhVRJaTRJSUJkWaGKfZBIBAnlHILjyQGZswQyTWjsrSBcncejjyrmiBdrmLOjkCv",
    deviceId: "d777aa0c-de64-4e25-9de7-bea768ba777d",
    notifications: [
      {
        gameId: "a5551f88-3f1a-4492-978b-30770358555a",
        sent: true,
      },
    ],
  },
] as const;

async function getNotifications(apiKey: string, deviceId: string) {
  const url = new URL(
    `${process.env.VITE_API_URL}/api/trpc/notification.byDeviceId`,
  );

  url.searchParams.append("batch", "1");
  url.searchParams.append("input", `{"0":{"json":"${deviceId}"}}`);

  return fetch(url.toString(), {
    headers: {
      "Content-Type": "application/json",
      "x-api-key": apiKey,
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

test("Users receive expected notifications", async () => {
  for (const user of TEST_USER_SCENARIOS) {
    const { apiKey, deviceId, notifications: notificationsExpected } = user;
    const notificationsReceived = await getNotifications(apiKey, deviceId);

    expect(
      notificationsReceived,
      `No notification data for user apiKey ${apiKey} with device ${deviceId}`,
    ).not.toBeUndefined();

    expect(
      notificationsReceived?.length,
      `Number of received notifications (${
        notificationsReceived?.length
      }) doesn't match number of expected notifications (${
        notificationsExpected.length
      }) for user apiKey ${apiKey} with device ${deviceId}`,
    ).toBe(notificationsExpected.length);
    notificationsReceived?.forEach((received) => {
      expect(
        notificationsExpected.some((expected) => {
          let sentAsExpected =
            expected.gameId === received.gameId &&
            !!expected.sent === !!received.sentOn;

          if (typeof expected.sent === "string") {
            sentAsExpected =
              sentAsExpected &&
              !!received.sentOn &&
              new Date(expected.sent).getTime() ===
                new Date(received.sentOn).getTime();
          }
          if (expected.sent === null) {
            sentAsExpected = sentAsExpected && received.sentOn === null;
          }

          return sentAsExpected;
        }),
        `Received notification not matched for user apiKey ${
          apiKey
        } with device ${deviceId}. Expected: ${JSON.stringify(
          notificationsExpected,
        )}, Received: ${JSON.stringify(received)}`,
      ).toBe(true);
    });
  }
});
