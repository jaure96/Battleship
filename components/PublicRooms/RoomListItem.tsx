import useJoinBattle from "@/hooks/useJoinBattle";
import { Room } from "@/types/room";
import { Fontisto, MaterialIcons } from "@expo/vector-icons";
import React from "react";
import { Text, TouchableOpacity, View } from "react-native";

type Props = {
  room: Room;
};

const RoomListItem = ({ room }: Props) => {
  const { handleJoinBattle } = useJoinBattle();

  return (
    <View className="flex-row h-15 border-2 border-border justify-between items-center py-2 my-1 px-2">
      <View className="flex-col gap-1">
        <View className="flex-row gap-2 items-center">
          <Fontisto name="world-o" color="#ffcc33" size={12} />
          <Text className="text-white font-mono">
            {room.name.length > 15 ? `${room.name.slice(0, 15)}…` : room.name}
          </Text>
        </View>
        <View className="flex-row gap-2 items-center">
          <MaterialIcons name="people" color="#ffcc33" size={12} />
          <Text className="font-mono text-xs color-white/35">
            ({room.playersCount}/2)
          </Text>
        </View>
      </View>

      <TouchableOpacity
        activeOpacity={0.8}
        className="bg-transparent  py-2 px-4 border-background border-[1px] rounded-s  justify-center items-center"
        onPress={() => handleJoinBattle("public")}
      >
        <Text className="font-mono text-background">Join </Text>
      </TouchableOpacity>
    </View>
  );
};

export default RoomListItem;
