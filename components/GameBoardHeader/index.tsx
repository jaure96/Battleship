import React from "react";
import { Text, View } from "react-native";

const GameBoardHeader = () => {
  return (
    <View className="h-20 justify-center items-center  bg-red-400">
      <Text className="text-white text-center">Battle stats</Text>
    </View>
  );
};

export default GameBoardHeader;
