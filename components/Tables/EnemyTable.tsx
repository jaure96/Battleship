import { BOARD_SIZE, CELLS } from "@/constants/table";
import { useGame } from "@/context/GameContext";
import { MoveResult } from "@/types/move";
import { Coord } from "@/types/ship";
import { getCellMove, getEnemySunkCells, getMyMoves } from "@/utils/moves";
import {
  FontAwesome6,
  Foundation,
  MaterialCommunityIcons,
} from "@expo/vector-icons";
import React, { useCallback, useMemo, useRef, useState } from "react";
import { Text, TouchableOpacity, View } from "react-native";

type Props = {
  toastError: (message: string, duration: number) => void;
};

const EnemyTable = ({ toastError }: Props) => {
  const { playerId, match, moves, players, makeMove } = useGame();
  const sunkSet = useRef(new Set<string>());
  const [sunkCells, setSunkCells] = useState<Coord[]>([]);
  const [isAttacking, setIsAttacking] = useState(false);
  const myTurn = useMemo(
    () => playerId === match?.turn_player_id,
    [playerId, match?.turn_player_id]
  );
  const tableDisabled = useMemo(
    () => !myTurn || isAttacking,
    [myTurn, isAttacking]
  );
  const myMoves = useMemo(() => getMyMoves(moves, playerId), [moves, playerId]);

  const addSunkCells = (coords: Coord[]) => {
    const newCells: Coord[] = [];
    coords.forEach((coord) => {
      const key = `${coord.x},${coord.y}`;
      if (!sunkSet.current.has(key)) {
        sunkSet.current.add(key);
        newCells.push(coord);
      }
    });
    if (newCells.length > 0) setSunkCells((prev) => [...prev, ...newCells]);
  };

  const onShootHandler = useCallback(async (index: number) => {
    setIsAttacking(true);
    const x = index % BOARD_SIZE;
    const y = Math.floor(index / BOARD_SIZE);
    try {
      const { error } = await makeMove(x, y);
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
    if (move?.result === MoveResult.SUNK) {
      const sunkCells = getEnemySunkCells(players, move, playerId);
      addSunkCells(sunkCells);
    }
    if (move?.result === MoveResult.HIT || move?.result === MoveResult.SUNK)
      icon = <FontAwesome6 name="explosion" color="orange" size={18} />;
    if (move?.result === MoveResult.MISS) {
      icon = (
        <MaterialCommunityIcons name="waves" color={"#0099e6"} size={18} />
      );
      bg = "bg-border";
    }
    return {
      icon: <Text className="text-center font-mono color-white ">{icon}</Text>,
      bg,
    };
  };

  const isCellSunk = (coord: Coord): boolean =>
    sunkCells.some((c) => c.x === coord.x && c.y === coord.y);

  return (
    <View className="flex-1 items-center justify-center bg-black/80 py-6 mx-2 rounded-sm ">
      <View className="aspect-square w-10/12 flex-row flex-wrap border-2 border-border items-center justify-center ">
        {CELLS.map((_, i) => {
          const x = i % BOARD_SIZE;
          const y = Math.floor(i / BOARD_SIZE);
          const { icon, bg } = getCellIcon(x, y);
          const isSunk = isCellSunk({ x, y });

          return (
            <TouchableOpacity
              key={`enemy-${i}`}
              className={`w-[10%] h-[10%] border border-border items-center justify-center ${
                !isSunk ? bg : "bg-red-300/60"
              }`}
              onPress={() => onShootHandler(i)}
              activeOpacity={0.8}
              disabled={tableDisabled}
            >
              {!isSunk ? (
                icon
              ) : (
                <Foundation name="skull" color="#bd0600" size={18} />
              )}
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
};

export default EnemyTable;
