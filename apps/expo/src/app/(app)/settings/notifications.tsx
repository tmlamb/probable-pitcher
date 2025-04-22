import { PermissionStatus } from "expo-modules-core";
import * as ExpoNotifications from "expo-notifications";
import React, { useEffect, useRef, useState } from "react";
import { AppState, Linking, Switch } from "react-native";
import * as Sentry from "@sentry/react-native";
import { api } from "~/utils/api";
import Background from "~/components/Background";
import tw from "~/utils/tailwind";
import Card from "~/components/Card";
import TextThemed, { variantClasses } from "~/components/TextThemed";
import PressableThemed from "~/components/PressableThemed";

export default function Notifications() {
  const utils = api.useUtils();

  const [expoPushToken, setExpoPushToken] = useState<string>();
  const [pushPermissionStatus, setPushPermissionStatus] =
    useState<PermissionStatus | null>(null);

  const { mutate: toggleNotifications, isPending } =
    api.device.toggleNotifications.useMutation({
      scope: { id: "device" },
      onMutate: async ({ enabled }) => {
        await utils.device.byPushToken.cancel(expoPushToken);
        const currentDevice = utils.device.byPushToken.getData(expoPushToken);
        utils.device.byPushToken.setData(expoPushToken ?? "", (old) =>
          old
            ? {
                ...old,
                enabled,
              }
            : undefined,
        );
        return { currentDevice };
      },
      onError: (err, _, context) => {
        utils.device.byPushToken.setData(
          expoPushToken ?? "",
          context?.currentDevice,
        );
        Sentry.captureException("Error toggling notifications", err);
      },
      onSettled: () => {
        utils.device.byPushToken.invalidate(expoPushToken).catch(console.error);
      },
    });

  const { data: device, isSuccess: deviceFetched } =
    api.device.byPushToken.useQuery(expoPushToken ?? "", {
      enabled: !!expoPushToken && !isPending,
    });

  const appState = useRef(AppState.currentState);

  function checkStatus() {
    ExpoNotifications.getPermissionsAsync()
      .then(({ status }) => {
        setPushPermissionStatus(status);
      })
      .catch(console.error);

    ExpoNotifications.getExpoPushTokenAsync()
      .then(({ data: token }) => {
        setExpoPushToken(token);
      })
      .catch(console.error);
  }

  useEffect(() => {
    checkStatus();

    const listener = AppState.addEventListener("change", (nextAppState) => {
      if (
        /inactive|background/.exec(appState.current) &&
        nextAppState === "active"
      ) {
        checkStatus();
      }
      appState.current = nextAppState;
    });
    return () => {
      listener.remove();
    };
  }, []);

  const permissionGranted = pushPermissionStatus === PermissionStatus.GRANTED;

  return (
    <Background>
      <Card style={tw`mt-8`}>
        <TextThemed>Notifications Enabled</TextThemed>
        <Switch
          trackColor={{
            true: String(tw.style(variantClasses.primary).color),
            false: String(tw.style(variantClasses.muted).color),
          }}
          ios_backgroundColor={String(tw.style(variantClasses.muted).color)}
          onValueChange={() =>
            device
              ? toggleNotifications({
                  id: device.id,
                  enabled: !device.notificationsEnabled,
                })
              : undefined
          }
          value={!!device?.notificationsEnabled && permissionGranted}
          disabled={
            !deviceFetched || !permissionGranted || !device || isPending
          }
        />
      </Card>
      {!permissionGranted && (
        <>
          <TextThemed
            variant="muted"
            style={tw`mx-4 mt-1.5 text-sm`}
            accessibilityRole="summary"
          >
            Permission to receive notifications from this app has been denied in
            your device&apos;s settings. To receive Probable Pitcher alerts,
            allow this app to send notifications.
          </TextThemed>
          <PressableThemed
            style={tw`mx-4 mt-1.5`}
            onPress={() => Linking.openSettings().catch(console.error)}
          >
            <TextThemed variant="primary" style={tw`text-sm`}>
              Open Application Settings
            </TextThemed>
          </PressableThemed>
        </>
      )}
    </Background>
  );
}
