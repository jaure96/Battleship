import React, { useState } from "react";
import { FlatList, TextInput, View } from "react-native";
import BattleListItem from "./BattleListItem";

type Props = {
  containerClass?: string;
};

const PublicRooms = ({ containerClass }: Props) => {
  const [roomName, setRoomName] = useState("");

  return (
    <View
      className={`flex-col w-full pb-6  rounded-xl gap-3 ${containerClass}`}
    >
      <TextInput
        value={roomName}
        className="bg-slate-400/30 color-white/50 rounded-sm font-mono"
        maxLength={30}
        onChangeText={(val) => setRoomName(val)}
        placeholder="Search for battles..."
      />
      <FlatList
        persistentScrollbar
        data={[
          { code: "1", name: "battle 1", playersCount: 1 },
          { code: "2", name: "battle 2", playersCount: 1 },
          { code: "3", name: "battle 3", playersCount: 1 },
          { code: "4", name: "battle 4", playersCount: 1 },
          { code: "5", name: "battle 5", playersCount: 1 },
          { code: "6", name: "battle 6", playersCount: 1 },
          { code: "7", name: "battle 7", playersCount: 1 },
          { code: "8", name: "battle 8", playersCount: 1 },
          { code: "9", name: "battle 9", playersCount: 1 },
          { code: "10", name: "battle 10", playersCount: 1 },
        ]}
        renderItem={({ item }) => <BattleListItem battle={item} />}
        keyExtractor={(item) => item.code}
        className="max-h-60"
      />
    </View>
  );
};

export default PublicRooms;
