import { BOARD_SIZE, CELLS } from "@/constants/table";
import { useGame } from "@/context/GameContext";
import { Match } from "@/types/match";
import { MoveResponse } from "@/types/move";
import React, { useCallback, useMemo, useState } from "react";
import { TouchableOpacity, View } from "react-native";

type Props = {
  match: Match;
  onMakeMove: (
    x: number,
    y: number
  ) => Promise<{
    data: MoveResponse | null;
    error: any;
  }>;
  toastError: (message: string, duration: number) => void;
};

const EnemyTable = ({ match, onMakeMove, toastError }: Props) => {
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

  const onShootHandler = useCallback(async (index: number) => {
    setIsAttacking(true);
    const x = index % BOARD_SIZE;
    const y = Math.floor(index / BOARD_SIZE);
    try {
      const { data, error } = await onMakeMove(x, y);
      console.log(data);
      console.log(error);
      if (error) throw new Error(error.message);
      setIsAttacking(false);
    } catch (_e) {
      setIsAttacking(false);
      toastError("Something went wrong while attacking.", 3_000);
    }
  }, []);

  return (
    <View className="flex-1 items-center justify-center bg-black/80 py-6 mx-2 rounded-sm ">
      <View className="aspect-square w-10/12 flex-row flex-wrap border-2 border-border">
        {CELLS.map((_, i) => (
          <TouchableOpacity
            key={`enemy-${i}`}
            className="w-[10%] h-[10%] border border-border"
            onPress={() => onShootHandler(i)}
            activeOpacity={0.8}
            disabled={tableDisabled}
          />
        ))}
      </View>
    </View>
  );
};

export default EnemyTable;
