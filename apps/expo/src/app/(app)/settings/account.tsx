import { ActivityIndicator, View } from "react-native";
import { AntDesign } from "@expo/vector-icons";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { capitalizeFirstLetter } from "@probable/ui";

import Background from "~/components/Background";
import Card from "~/components/Card";
import DoubleConfirm from "~/components/DoubleConfirmButton";
import PressableThemed from "~/components/PressableThemed";
import TextThemed from "~/components/TextThemed";
import { trpc } from "~/utils/api";
import { authClient } from "~/utils/auth";
import tw from "~/utils/tailwind";

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
    <Background>
      <View style={tw`mt-8 flex-1`}>
        <Card style={tw`rounded-b-none rounded-t-xl border-b-2`}>
          <TextThemed style={tw``}>Identity Providers</TextThemed>
          {providers ? (
            <TextThemed variant="muted" style={tw`capitalize`}>
              {providers}
            </TextThemed>
          ) : (
            <ActivityIndicator size="small" />
          )}
        </Card>
        <PressableThemed
          onPress={async () => {
            await authClient.signOut().finally(() => {
              queryClient
                .invalidateQueries(trpc.pathFilter())
                .catch(console.error);
            });
          }}
          accessibilityLabel={"Logout"}
        >
          <Card style={tw.style("rounded-b-xl rounded-t-none")}>
            <TextThemed variant="muted">Logout</TextThemed>
            <TextThemed variant="muted" style={tw``}>
              <AntDesign name="logout" size={18} />
            </TextThemed>
          </Card>
        </PressableThemed>
        <DoubleConfirm
          style={tw`mt-6`}
          first={
            <Card style={tw`rounded-xl`}>
              <TextThemed variant="alert">Delete Account</TextThemed>
            </Card>
          }
          second={
            <PressableThemed
              onPress={() => {
                deleteAccount();
                queryClient
                  .invalidateQueries(trpc.pathFilter())
                  .catch(console.error);
              }}
            >
              <TextThemed variant="alert" style={tw`-my-3 px-4 py-3`}>
                <AntDesign name="minuscircle" size={15} />
              </TextThemed>
            </PressableThemed>
          }
          accessibilityLabel={`Irreversibly delete account and all user data`}
        />
      </View>
    </Background>
  );
}
