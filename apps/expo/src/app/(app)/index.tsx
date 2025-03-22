import { AntDesign } from "@expo/vector-icons";
import React, { useEffect, useState } from "react";
import { Pressable, Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { api } from "~/utils/api";
import { authClient } from "~/utils/auth";
import tw from "~/utils/tailwind";
import Background from "../components/Background";

export default function Index() {
  return (
    <Background>
      <SafeAreaView></SafeAreaView>
    </Background>
  );
}
