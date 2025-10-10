import { CELLS } from "@/constants/table";
import React from "react";
import { TouchableOpacity, View } from "react-native";

const EnemyTable = () => {
  return (
    <View className="flex-1 items-center justify-center bg-black/80 py-6 mx-2 rounded-sm ">
      <View className="aspect-square w-10/12 flex-row flex-wrap border-2 border-border">
        {CELLS.map((_, i) => (
          <TouchableOpacity
            key={`enemy-${i}`}
            className="w-[10%] h-[10%] border border-black/80 bg-blue-800 active:bg-blue-700"
            onPress={() => console.log(`Disparo en ${i}`)}
            activeOpacity={0.8}
          />
        ))}
      </View>
    </View>
  );
};

export default EnemyTable;
