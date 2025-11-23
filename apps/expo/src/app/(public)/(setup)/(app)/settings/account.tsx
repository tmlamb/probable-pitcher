import { ActivityIndicator, Text, View } from "react-native";
import Feather from "@expo/vector-icons/Feather";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import * as Sentry from "@sentry/react-native";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { capitalizeFirstLetter } from "@probable/ui/utils";

import Card from "~/components/Card";
import DoubleConfirm from "~/components/DoubleConfirmButton";
import PressableThemed from "~/components/PressableThemed";
import { trpc } from "~/utils/api";
import { authClient } from "~/utils/auth";

export default function Account() {
  const queryClient = useQueryClient();

  const { data: accounts } = useQuery(
    trpc.account.byUserId.queryOptions(undefined, {
      staleTime: Infinity,
    }),
  );

  const providers = accounts
    ?.map(({ providerId }) => capitalizeFirstLetter(providerId))
    .join(", ");

  const { mutate: deleteAccount } = useMutation(
    trpc.user.delete.mutationOptions({
      onSuccess: () => authClient.signOut(),
    }),
  );

  return (
    <View className="bg-background flex-1 pt-8">
      <Card className="border-border flex-wrap rounded-b-none border-b-1">
        <Text maxFontSizeMultiplier={2.5} className="text-foreground text-xl">
          Identity Providers
        </Text>
        {providers ? (
          <Text maxFontSizeMultiplier={2.5} className="text-muted text-xl">
            {providers}
          </Text>
        ) : (
          <ActivityIndicator size="small" />
        )}
      </Card>
      <PressableThemed
        onPress={async () => {
          await authClient.signOut().finally(() => queryClient.clear());
        }}
        accessibilityLabel={"Logout"}
      >
        <Card className="rounded-t-none">
          <Text maxFontSizeMultiplier={2.5} className="text-muted text-xl">
            Logout
          </Text>
          <Text maxFontSizeMultiplier={2.5} className="text-muted">
            <Feather name="log-out" size={22} />
          </Text>
        </Card>
      </PressableThemed>
      <DoubleConfirm
        className="mt-6"
        first={
          <Card>
            <Text
              maxFontSizeMultiplier={2.5}
              className="text-destructive text-xl"
            >
              Delete Account
            </Text>
          </Card>
        }
        second={
          <PressableThemed
            onPress={() => {
              deleteAccount();
              queryClient
                .invalidateQueries(trpc.pathFilter())
                .catch(Sentry.captureException);
            }}
          >
            <Text
              maxFontSizeMultiplier={2.5}
              className="text-destructive -my-3 px-4 py-3"
            >
              <FontAwesome name="minus-circle" size={18} />
            </Text>
          </PressableThemed>
        }
        accessibilityLabel={`Irreversibly delete account and all user data`}
      />
    </View>
  );
}
