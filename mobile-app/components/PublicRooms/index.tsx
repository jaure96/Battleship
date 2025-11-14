import React, { useCallback, useEffect } from "react";
import { FlatList, Text, View } from "react-native";
import BattleListItem from "./BattleListItem";
import EmptyList from "./EmptyList";

import { usePublicMatches } from "@/hooks/usePublicMatches";
import { useGame } from "@/context/GameContext";
import AnimatedDots from "./AnimatedDots";
import { Match } from "@/types/match";

type Props = {
  containerClass?: string;
  onJoinBattle: (code: string) => void;
  onError: (message: string, duration: number) => void;
};

const PublicRooms = ({ containerClass, onJoinBattle, onError }: Props) => {
  const { supabase } = useGame();
  const { error, loading, matches } = usePublicMatches(supabase);

  const joinBattle = useCallback(
    (battle: Match) => {
      if (battle.code) {
        onJoinBattle(battle.code);
      }
    },
    [onJoinBattle]
  );

  useEffect(() => {
    if (error) {
      onError("Ups... something went wrong!", 3000);
    }
  }, [error, onError]);

  return (
    <View
      className={`flex-col w-full pb-6 rounded-xl gap-3 min-h-60  justify-center items-center ${containerClass}`}
    >
      {loading && (
        <View className="flex flex-row">
          <Text className="flex flex-1 text-white font-mono text-right">
            Loading
          </Text>
          <AnimatedDots />
        </View>
      )}
      {!loading && (
        <FlatList
          persistentScrollbar
          data={matches}
          renderItem={({ item }) => (
            <BattleListItem battle={item} onSelect={joinBattle} />
          )}
          keyExtractor={(item) => item.code}
          className="max-h-60"
          ListEmptyComponent={<EmptyList />}
        />
      )}
    </View>
  );
};

export default PublicRooms;
