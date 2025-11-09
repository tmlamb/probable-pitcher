import { useEffect, useRef, useState } from "react";
import { AppState, Linking, Switch, Text, View } from "react-native";
import { useNativeVariable } from "react-native-css";
import { PermissionStatus } from "expo-modules-core";
import * as ExpoNotifications from "expo-notifications";
import * as Sentry from "@sentry/react-native";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import Card from "~/components/Card";
import PressableThemed from "~/components/PressableThemed";
import { trpc } from "~/utils/api";

export default function Notifications() {
  const queryClient = useQueryClient();
  const [expoPushToken, setExpoPushToken] = useState<string>();
  const [pushPermissionStatus, setPushPermissionStatus] =
    useState<PermissionStatus | null>(null);

  const primaryColor = useNativeVariable("--primary") as string;
  const mutedColor = useNativeVariable("--muted-foreground") as string;

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
    <View className="bg-background flex-1 pt-8">
      <Card className="py-0">
        <Text className="text-foreground text-xl">Notifications Enabled</Text>
        <Switch
          trackColor={{
            true: primaryColor,
            false: mutedColor,
          }}
          ios_backgroundColor={mutedColor}
          className="my-auto"
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
        <View className="mx-6 mt-4.5">
          <Text className="text-muted text-base" accessibilityRole="summary">
            Permission to receive notifications from this app has been denied in
            your device&apos;s settings. To receive Probable Pitcher alerts,
            allow this app to send notifications.
          </Text>
          <PressableThemed
            className="mt-1.5"
            onPress={() => Linking.openSettings().catch(console.error)}
          >
            <Text className="text-primary text-base">
              Open Application Settings
            </Text>
          </PressableThemed>
        </View>
      )}
    </View>
  );
}
