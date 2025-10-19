import React, { useEffect, useRef, useState } from "react";
import { AppState, Linking, Switch } from "react-native";
import { PermissionStatus } from "expo-modules-core";
import * as ExpoNotifications from "expo-notifications";
import * as Sentry from "@sentry/react-native";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import Background from "~/components/Background";
import Card from "~/components/Card";
import PressableThemed from "~/components/PressableThemed";
import TextThemed, { variantClasses } from "~/components/TextThemed";
import { trpc } from "~/utils/api";
import tw from "~/utils/tailwind";

export default function Notifications() {
  const queryClient = useQueryClient();
  const [expoPushToken, setExpoPushToken] = useState<string>();
  const [pushPermissionStatus, setPushPermissionStatus] =
    useState<PermissionStatus | null>(null);

  const { mutate: toggleNotifications, isPending } = useMutation(
    trpc.device.toggleNotifications.mutationOptions({
      scope: { id: "device" },
      onMutate: async ({ enabled }) => {
        await queryClient.cancelQueries(trpc.device.byPushToken.pathFilter());
        const currentDevice = queryClient.getQueryData(
          trpc.device.byPushToken.queryKey(expoPushToken),
        );
        queryClient.setQueryData(
          trpc.device.byPushToken.queryKey(expoPushToken ?? ""),
          (old) =>
            old
              ? {
                  ...old,
                  enabled,
                }
              : undefined,
        );
        queryClient
          .invalidateQueries(trpc.device.byPushToken.pathFilter())
          .catch(console.error);
        return { currentDevice };
      },
      onError: (err, _, context) => {
        queryClient.setQueryData(
          trpc.device.byPushToken.queryKey(expoPushToken ?? ""),
          context?.currentDevice,
        );
        Sentry.captureException("Error toggling notifications", err);
      },
      onSettled: () => {
        queryClient
          .invalidateQueries(trpc.device.byPushToken.pathFilter())
          .catch(console.error);
      },
    }),
  );

  const { data: device, isSuccess: deviceFetched } = useQuery(
    trpc.device.byPushToken.queryOptions(expoPushToken ?? "", {
      enabled: !!expoPushToken,
    }),
  );

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
            true: String(tw.style(variantClasses.primary).color as string),
            false: String(tw.style(variantClasses.muted).color as string),
          }}
          ios_backgroundColor={String(
            tw.style(variantClasses.muted).color as string,
          )}
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
