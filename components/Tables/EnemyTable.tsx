import { Text, TouchableOpacity, View } from "react-native";

import { BOARD_SIZE, CELLS } from "@/constants/table";
import { useGame } from "@/context/GameContext";
import { Match } from "@/types/match";
import { Move, MoveResponse, MoveResult } from "@/types/move";
import { getCellMove, getMyMoves } from "@/utils/moves";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import React, { useCallback, useMemo, useState } from "react";

type Props = {
  match: Match;
  matchMoves: Move[];
  onMakeMove: (
    x: number,
    y: number
  ) => Promise<{
    data: MoveResponse | null;
    error: any;
  }>;
  toastError: (message: string, duration: number) => void;
};

const EnemyTable = ({ match, matchMoves, onMakeMove, toastError }: Props) => {
  const [isAttacking, setIsAttacking] = useState(false);

  const { playerId } = useGame();
  const myTurn = useMemo(
    () => playerId === match.turn_player_id,
    [playerId, match.turn_player_id]
  );
  const tableDisabled = useMemo(
    () => !myTurn || isAttacking,
    [myTurn, isAttacking]
  );

  const myMoves = useMemo(
    () => getMyMoves(matchMoves, playerId),
    [matchMoves, playerId]
  );

  const onShootHandler = useCallback(async (index: number) => {
    setIsAttacking(true);
    const x = index % BOARD_SIZE;
    const y = Math.floor(index / BOARD_SIZE);
    try {
      const { error } = await onMakeMove(x, y);
      if (error) throw new Error(error.message);
      setIsAttacking(false);
    } catch (_e) {
      setIsAttacking(false);
      toastError("Something went wrong while attacking.", 3_000);
    }
  }, []);

  const getCellIcon = (x: number, y: number) => {
    const move = getCellMove(myMoves, { x, y });
    let icon = null;
    let bg = "bg-transparent";
    if (move === MoveResult.HIT || move === MoveResult.SUNK) {
      icon = "💥";
    }
    if (move === MoveResult.MISS) {
      icon = <MaterialCommunityIcons name="waves" color={"#0099e6"} />;
      bg = "bg-border";
    }
    return {
      icon: <Text className="text-center font-mono color-white ">{icon}</Text>,
      bg,
    };
  };

  return (
    <View className="flex-1 items-center justify-center bg-black/80 py-6 mx-2 rounded-sm ">
      <View className="aspect-square w-10/12 flex-row flex-wrap border-2 border-border items-center justify-center ">
        {CELLS.map((_, i) => {
          const x = i % BOARD_SIZE;
          const y = Math.floor(i / BOARD_SIZE);
          const { icon, bg } = getCellIcon(x, y);
          return (
            <TouchableOpacity
              key={`enemy-${i}`}
              className={`w-[10%] h-[10%] border border-border items-center justify-center ${bg}`}
              onPress={() => onShootHandler(i)}
              activeOpacity={0.8}
              disabled={tableDisabled}
            >
              {icon}
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
};

export default EnemyTable;
