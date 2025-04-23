import { AntDesign } from "@expo/vector-icons";
import { ActivityIndicator, View } from "react-native";
import { authClient } from "~/utils/auth";
import PressableThemed from "~/components/PressableThemed";
import DoubleConfirm from "~/components/DoubleConfirmButton";
import Card from "~/components/Card";
import TextThemed from "~/components/TextThemed";
import tw from "~/utils/tailwind";
import { api } from "~/utils/api";
import Background from "~/components/Background";
import { capitalizeFirstLetter } from "@probable/ui";

export default function Account() {
  const { data: accounts } = api.account.byUserId.useQuery(undefined, {
    staleTime: Infinity,
  });

  const providers = accounts
    ?.map(({ providerId }) => capitalizeFirstLetter(providerId))
    .join();

  const { mutate: deleteAccount } = api.user.delete.useMutation({});

  return (
    <Background>
      <View style={tw`flex-1 mt-8`}>
        <Card style={tw`border-b-2 rounded-t-xl rounded-b-none`}>
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
          onPress={() => authClient.signOut()}
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
                authClient.signOut().catch(console.error);
              }}
            >
              <TextThemed variant="alert" style={tw`px-4 py-3 -my-3`}>
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
