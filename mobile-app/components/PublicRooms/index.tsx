import React from "react";
import { FlatList, View } from "react-native";
import BattleListItem from "./BattleListItem";
import EmptyList from "./EmptyList";

type Props = {
  containerClass?: string;
};

const PublicRooms = ({ containerClass }: Props) => {
  return (
    <View
      className={`flex-col w-full pb-6  rounded-xl gap-3 ${containerClass}`}
    >
      <FlatList
        persistentScrollbar
        data={[
          { code: "1", name: "battle 1", playersCount: 1 },
          { code: "2", name: "battle 2", playersCount: 1 },
          { code: "10", name: "battle 10", playersCount: 1 },
        ]}
        renderItem={({ item }) => <BattleListItem battle={item} />}
        keyExtractor={(item) => item.code}
        className="max-h-60"
        ListEmptyComponent={<EmptyList />}
      />
    </View>
  );
};

export default PublicRooms;
