import { useCallback, useEffect, useRef, useState } from "react";
import { AppState, Linking, Switch, Text, View } from "react-native";
import { useNativeVariable } from "react-native-css";
import { PermissionStatus } from "expo-modules-core";
import * as ExpoNotifications from "expo-notifications";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { usePostHog } from "posthog-react-native";

import Card from "~/components/Card";
import PressableThemed from "~/components/PressableThemed";
import { trpc } from "~/utils/api";

export default function Notifications() {
  const queryClient = useQueryClient();
  const posthog = usePostHog();
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
          .catch((e) => posthog.captureException(e));
        return { currentDevice };
      },
      onError: (err, _, context) => {
        queryClient.setQueryData(
          trpc.device.byPushToken.queryKey(expoPushToken ?? ""),
          context?.currentDevice,
        );
        posthog.captureException(err);
      },
      onSettled: () => {
        queryClient
          .invalidateQueries(trpc.device.byPushToken.pathFilter())
          .catch((e) => posthog.captureException(e));
      },
    }),
  );

  const { data: device, isSuccess: deviceFetched } = useQuery(
    trpc.device.byPushToken.queryOptions(expoPushToken ?? "", {
      enabled: !!expoPushToken,
    }),
  );

  const appState = useRef(AppState.currentState);

  const checkStatus = useCallback(() => {
    ExpoNotifications.getPermissionsAsync()
      .then(({ status }) => {
        setPushPermissionStatus(status);
      })
      .catch((e) => posthog.captureException(e));

    ExpoNotifications.getExpoPushTokenAsync()
      .then(({ data: token }) => {
        setExpoPushToken(token);
      })
      .catch((e) => posthog.captureException(e));
  }, [posthog]);

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
  }, [checkStatus]);

  const permissionGranted = pushPermissionStatus === PermissionStatus.GRANTED;

  return (
    <View className="bg-background flex-1 pt-8">
      <Card className="flex-wrap py-2">
        <Text maxFontSizeMultiplier={2} className="text-foreground text-xl">
          Notifications Enabled
        </Text>
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
          <Text
            maxFontSizeMultiplier={2}
            className="text-muted text-base"
            accessibilityRole="summary"
          >
            Permission to receive notifications from this app has been denied in
            your device&apos;s settings. To receive Probable Pitcher alerts,
            allow this app to send notifications.
          </Text>
          <PressableThemed
            className="mt-1.5"
            onPress={() =>
              Linking.openSettings().catch((e) => posthog.captureException(e))
            }
          >
            <Text maxFontSizeMultiplier={2} className="text-primary text-base">
              Open Application Settings
            </Text>
          </PressableThemed>
        </View>
      )}
    </View>
  );
}
