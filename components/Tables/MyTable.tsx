import { CELLS } from "@/constants/table";
import React from "react";
import { View } from "react-native";

const MyTable = () => {
  return (
    <View className="flex-1 items-center justify-center bg-black/80 py-6 mx-2 rounded-sm ">
      <View className="aspect-square w-10/12 flex-row flex-wrap border-2 border-border">
        {CELLS.map((_, i) => (
          <View
            key={`player-${i}`}
            className="w-[10%] h-[10%] border border-border bg-blue-600"
          />
        ))}
      </View>
    </View>
  );
};

export default MyTable;
