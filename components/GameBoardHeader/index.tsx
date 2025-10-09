import { Match } from "@/types/match";
import { useNavigation } from "expo-router";

import React from "react";
import { Button, Text, View } from "react-native";

type Props = {
  match: Match;
};

const GameBoardHeader = ({ match }: Props) => {
  const { navigate } = useNavigation();
  return (
    <View className="h-20 justify-center items-center  bg-red-400">
      <Text className="text-white text-center">{match.name}</Text>
      <Text className="text-white text-center">({match.code})</Text>
      <Button title="Go back" onPress={() => navigate("index")} />
    </View>
  );
};

export default GameBoardHeader;
