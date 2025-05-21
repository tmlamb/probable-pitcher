import { useEffect, useRef, useState } from "react";
import { Alert, AppState, Platform } from "react-native";
import * as Device from "expo-device";
import * as ExpoNotifications from "expo-notifications";
import { useRouter } from "expo-router";
import * as Sentry from "@sentry/react-native";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { trpc } from "~/utils/api";

ExpoNotifications.setNotificationHandler({
  handleNotification: async () => {
    return Promise.resolve({
      shouldShowBanner: true,
      shouldShowAlert: true,
      shouldPlaySound: false,
      shouldSetBadge: true,
      shouldShowList: true,
    });
  },
});

export default function useNotifications({ enabled }: { enabled: boolean }) {
  const [expoPushToken, setExpoPushToken] = useState<string>();
  const [, setNotification] = useState(false);
  const router = useRouter();

  const appState = useRef(AppState.currentState);
  const notificationListener =
    useRef<ExpoNotifications.EventSubscription>(undefined);
  const responseListener =
    useRef<ExpoNotifications.EventSubscription>(undefined);

  const queryClient = useQueryClient();

  useEffect(() => {
    function handleNotificationSetup() {
      registerForPushNotifications()
        .then((pushToken) => {
          setExpoPushToken(pushToken);
        })
        .catch((error) => {
          Sentry.captureException(error);
        });
    }

    if (enabled) handleNotificationSetup();

    const listener = AppState.addEventListener("change", (nextAppState) => {
      if (
        /inactive|background/.exec(appState.current) &&
        nextAppState === "active"
      ) {
        handleNotificationSetup();
      }
      appState.current = nextAppState;
    });

    return () => {
      listener.remove();
    };
  }, [enabled]);

  const { mutate: registerDevice } = useMutation(
    trpc.device.create.mutationOptions({
      onError: (err) => {
        Sentry.captureException(err);
      },
      onSettled: () => queryClient.invalidateQueries(trpc.device.pathFilter()),
    }),
  );
  const { mutate: updateDevice } = useMutation(
    trpc.device.update.mutationOptions({
      onError: (err) => {
        Sentry.captureException(err);
      },
      onSettled: () => queryClient.invalidateQueries(trpc.device.pathFilter()),
    }),
  );

  const { data: device, isFetched: deviceFetched } = useQuery(
    trpc.device.byPushToken.queryOptions(expoPushToken ?? "", {
      enabled: !!expoPushToken,
    }),
  );

  useEffect(() => {
    if (deviceFetched && expoPushToken) {
      const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
      if (!device) {
        registerDevice({ pushToken: expoPushToken, timezone });
      } else if (device.timezone !== timezone) {
        updateDevice({
          id: device.id,
          pushToken: device.pushToken,
          timezone,
        });
      }
    }
  }, [device, deviceFetched, expoPushToken, registerDevice, updateDevice]);

  useEffect(() => {
    // This listener is fired whenever a notification is received while the app
    // is foregrounded
    notificationListener.current =
      ExpoNotifications.addNotificationReceivedListener((notification) => {
        setNotification(!!notification);
      });

    // This listener is fired whenever a user taps on or interacts with a
    // notification (works when app is foregrounded, backgrounded, or killed)
    responseListener.current =
      ExpoNotifications.addNotificationResponseReceivedListener(() => {
        router.replace("/");
      });

    return () => {
      notificationListener.current?.remove();
      responseListener.current?.remove();
    };
  }, [router]);
}

export async function registerForPushNotifications() {
  let token;
  if (Device.isDevice) {
    const { status: existingStatus } =
      await ExpoNotifications.getPermissionsAsync();

    let finalStatus = existingStatus;
    if (existingStatus !== ExpoNotifications.PermissionStatus.GRANTED) {
      const { status } = await ExpoNotifications.requestPermissionsAsync();
      finalStatus = status;
    }
    if (finalStatus !== ExpoNotifications.PermissionStatus.GRANTED) {
      return;
    }

    if (Platform.OS === "android") {
      ExpoNotifications.setNotificationChannelAsync("default", {
        name: "default",
        importance: ExpoNotifications.AndroidImportance.DEFAULT,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: "#FF231F7C",
      }).catch((error) => {
        Sentry.captureException(error);
      });
    }

    token = (await ExpoNotifications.getExpoPushTokenAsync()).data;

    if (!token) {
      Sentry.captureException(
        "Unable to get push token after permission was granted.",
      );
    }
  } else {
    Alert.alert("Must use physical device for Push Notifications");
  }

  return token;
}
