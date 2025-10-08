import { Fontisto } from "@expo/vector-icons";
import React, { useState } from "react";
import { FlatList, Text, TextInput, View } from "react-native";
import RoomListItem from "./RoomListItem";

type Props = {
  containerClass?: string;
};

const PublicRooms = ({ containerClass }: Props) => {
  const [roomName, setRoomName] = useState("");

  return (
    <View
      className={`flex-col w-full  py-6 bg-black/80 rounded-xl gap-3 ${containerClass}`}
    >
      <View className="flex-row gap-1">
        <Fontisto name="world-o" color="#ffcc33" size={22} />
        <Text className="font-mono text-xl color-white">Public rooms</Text>
      </View>
      <TextInput
        value={roomName}
        className="bg-slate-400/30 color-white/50 rounded-sm font-mono"
        maxLength={30}
        onChangeText={(val) => setRoomName(val)}
        placeholder="Search room..."
      />
      <FlatList
        data={[
          { code: "1", name: "ahdhdhdhdhdhdhdhdhdhdhdhdhd", playersCount: 1 },
          { code: "2", name: "2", playersCount: 1 },
          { code: "3", name: "3", playersCount: 1 },
          { code: "4", name: "4", playersCount: 1 },
          { code: "5", name: "5", playersCount: 1 },
          { code: "6", name: "6", playersCount: 1 },
          { code: "7", name: "7", playersCount: 1 },
          { code: "8", name: "8", playersCount: 1 },
          { code: "9", name: "9", playersCount: 1 },
          { code: "10", name: "10", playersCount: 1 },
        ]}
        renderItem={({ item }) => <RoomListItem room={item} />}
        keyExtractor={(item) => item.code}
        className="max-h-60"
      />
    </View>
  );
};

export default PublicRooms;
