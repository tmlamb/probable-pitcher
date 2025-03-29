import * as Device from "expo-device";
import * as ExpoNotifications from "expo-notifications";
import { useEffect, useRef, useState } from "react";
import { Alert, AppState, Platform } from "react-native";
import * as Sentry from "@sentry/react-native";
import { api } from "~/utils/api";

export default function useNotifications({ enabled }: { enabled: boolean }) {
  const [expoPushToken, setExpoPushToken] = useState<string>();
  const [, setNotification] = useState(false);

  const appState = useRef(AppState.currentState);
  const notificationListener = useRef<ExpoNotifications.EventSubscription>();
  const responseListener = useRef<ExpoNotifications.EventSubscription>();

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
      console.log("AppState change detected");
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

  const apiUtils = api.useUtils();

  const { mutate: registerDevice } = api.device.create.useMutation({
    onError: (err) => {
      Sentry.captureException(err);
    },
    onSettled: () => apiUtils.device.byPushToken.invalidate(),
  });
  const { mutate: updateDevice } = api.device.update.useMutation({
    onError: (err) => {
      Sentry.captureException(err);
    },
    onSettled: () => apiUtils.device.byPushToken.invalidate(),
  });

  const { data: device, isFetched: deviceFetched } =
    api.device.byPushToken.useQuery(expoPushToken ?? "", {
      enabled: !!expoPushToken,
    });

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
    // This listener is fired whenever a notification is received while the app is foregrounded
    notificationListener.current =
      ExpoNotifications.addNotificationReceivedListener((notification) => {
        setNotification(!!notification);
      });

    // This listener is fired whenever a user taps on or interacts with a notification (works when app is foregrounded, backgrounded, or killed)
    responseListener.current =
      ExpoNotifications.addNotificationResponseReceivedListener(() => {
        //navigation.navigate("Subscriptions");
      });

    return () => {
      if (notificationListener.current) {
        ExpoNotifications.removeNotificationSubscription(
          notificationListener.current,
        );
      }
      if (responseListener.current) {
        ExpoNotifications.removeNotificationSubscription(
          responseListener.current,
        );
      }
    };
  }, []);
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
    token = (await ExpoNotifications.getExpoPushTokenAsync()).data;

    if (!token) {
      Sentry.captureException(
        "Unable to get push token after permission was granted.",
      );
    }
  } else {
    Alert.alert("Must use physical device for Push Notifications");
  }

  if (Platform.OS === "android") {
    ExpoNotifications.setNotificationChannelAsync("default", {
      name: "default",
      importance: ExpoNotifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: "#FF231F7C",
    }).catch((error) => {
      Sentry.captureException(error);
    });
  }
  return token;
}
