import React from "react";
import { Text, View } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";

const EmptyList = () => {
  return (
    <View className="mt-4 content-center items-center ">
      <Text className="text-white text-center font-mono">No battles found</Text>
      <MaterialCommunityIcons name="sleep" color="white" size={30} />
    </View>
  );
};

export default EmptyList;
