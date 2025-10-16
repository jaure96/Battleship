import { SHIPS } from "@/constants/ships";
import { BOARD_SIZE, CELLS } from "@/constants/table";
import { useGame } from "@/context/GameContext";
import { MatchStatus } from "@/types/match";
import { MoveResult } from "@/types/move";
import { Ship } from "@/types/ship";
import { getCellMove, getEnemyMoves } from "@/utils/moves";
import { isValidPlacement } from "@/utils/placing";
import { Entypo } from "@expo/vector-icons";
import React, { useCallback, useMemo, useState } from "react";
import { Text, TouchableOpacity, View } from "react-native";

type Props = {
  toastError: (message: string, duration: number) => void;
};

const MyTable = ({ toastError }: Props) => {
  const { playerId, moves, setShipsAndReady, match } = useGame();

  const [ready, setReady] = useState(false);
  const [ships, setShips] = useState<Ship[]>(SHIPS);
  const [currentShipIndex, setCurrentShipIndex] = useState(0);
  const [occupied, setOccupied] = useState<Set<string>>(new Set());
  const currentShip = useMemo(
    () => ships[currentShipIndex],
    [currentShipIndex, ships]
  );

  const allShipsPlaced = useMemo(
    () => currentShipIndex >= ships.length,
    [currentShipIndex, ships.length]
  );

  const isCurrentShipClosed = useMemo(
    () =>
      currentShip ? currentShip.coords.length === currentShip.size : false,
    [currentShip]
  );

  const enemyMoves = useMemo(
    () => getEnemyMoves(moves, playerId),
    [moves, playerId]
  );

  const handlePressCell = useCallback(
    (x: number, y: number) => {
      if (!currentShip) return;
      const cellKey = `${x},${y}`;
      const isCellInCurrentShip = currentShip.coords.some(
        (c) => c.x === x && c.y === y
      );

      if (isCellInCurrentShip) {
        const newCoords = currentShip.coords.filter(
          (c) => !(c.x === x && c.y === y)
        );
        const updatedShips = ships.map((ship, i) =>
          i === currentShipIndex ? { ...ship, coords: newCoords } : ship
        );
        const newOccupied = new Set(occupied);
        newOccupied.delete(cellKey);
        setShips(updatedShips);
        setOccupied(newOccupied);
        return;
      }

      if (currentShip.coords.length >= currentShip.size) return;

      if (occupied.has(cellKey)) return;

      const newCoords = [...currentShip.coords, { x, y }];

      if (!isValidPlacement(newCoords)) return;

      const updatedShips = ships.map((ship, i) =>
        i === currentShipIndex ? { ...ship, coords: newCoords } : ship
      );

      const newOccupied = new Set(occupied);
      newOccupied.add(cellKey);

      setShips(updatedShips);
      setOccupied(newOccupied);

      if (newCoords.length === currentShip.size) {
        setCurrentShipIndex((prev) => prev + 1);
      }
    },
    [currentShip, currentShipIndex, occupied, ships]
  );

  const getCellColor = useCallback(
    (x: number, y: number) => {
      const isCurrentShipCell = currentShip?.coords.some(
        (c) => c.x === x && c.y === y
      );
      const isPreviousShipCell = ships
        .slice(0, currentShipIndex)
        .some((ship) => ship.coords.some((c) => c.x === x && c.y === y));
      let bg = "bg-transparent";
      let icon = null;
      const move = getCellMove(enemyMoves, { x, y });
      if (isCurrentShipCell && !isCurrentShipClosed) bg = "bg-cellTemp";
      if (isPreviousShipCell) bg = "bg-cellPlaced";
      if (move?.result === MoveResult.HIT || move?.result === MoveResult.SUNK)
        bg = "bg-cellHit";
      if (move?.result === MoveResult.MISS) {
        bg = "bg-cellMiss";
        icon = <Entypo name="circle" color="gray" size={18} />;
      }
      return { bg, icon };
    },
    [
      currentShip?.coords,
      currentShipIndex,
      isCurrentShipClosed,
      ships,
      enemyMoves,
    ]
  );

  const onResetShipsHandler = useCallback(() => {
    setShips(SHIPS);
    setCurrentShipIndex(0);
    setOccupied(new Set());
  }, []);

  const onReadyPressHandler = useCallback(async () => {
    try {
      if (!allShipsPlaced) return;
      const { error } = await setShipsAndReady(ships, true);
      if (error) throw new Error(error.message);
      setReady(true);
    } catch (e) {
      toastError("Error setting ships. Try again.", 3_000);
    }
  }, [allShipsPlaced, setShipsAndReady, ships, toastError]);

  return (
    <View className="flex-1 items-center justify-center bg-black/80 py-6 mx-2 rounded-sm ">
      <View className="aspect-square w-10/12 flex-row flex-wrap border-2 border-border items-center justify-center">
        {CELLS.map((_, i) => {
          const x = i % BOARD_SIZE;
          const y = Math.floor(i / BOARD_SIZE);
          const { bg, icon } = getCellColor(x, y);
          return (
            <TouchableOpacity
              key={`player-${i}`}
              className={`w-[10%] h-[10%] border border-border items-center justify-center ${bg}`}
              activeOpacity={0.8}
              onPress={() => handlePressCell(x, y)}
              disabled={match?.status === MatchStatus.IN_PROGRESS}
            >
              {icon}
            </TouchableOpacity>
          );
        })}
      </View>

      {match?.status === MatchStatus.PLACING && !ready && (
        <>
          <Text className="text-white mt-6 font-mono text-lg">
            Ships to place
          </Text>
          <Text className="text-white  font-mono text-md">
            (tap the cells to place the ships)
          </Text>

          <View className="flex-col mt-3">
            {ships.map((ship, index) => {
              const isCurrent = index === currentShipIndex;
              const isPlaced = ship.coords.length === ship.size;
              return (
                <Text
                  key={`ship-${index}`}
                  className={`text-white font-mono text-lg ${
                    isPlaced ? "line-through text-gray-400" : ""
                  } ${isCurrent ? "underline" : ""}`}
                >
                  {ship.name} ({ship.size}) - {ship.coords.length}/{ship.size}{" "}
                  placed
                </Text>
              );
            })}
          </View>
          <View className="flex-1 flex-row mt-6  w-full justify-around">
            <TouchableOpacity
              className="border-red-500 border px-4 py-2 rounded-md"
              activeOpacity={0.8}
              onPress={onResetShipsHandler}
            >
              <Text className="text-red-500 font-mono text-lg">
                Reset ships
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              className="border-primary  border px-4 py-2 rounded-md"
              disabled={!allShipsPlaced}
              activeOpacity={0.8}
              style={{ opacity: allShipsPlaced ? 1 : 0.5 }}
              onPress={onReadyPressHandler}
            >
              <Text className="text-primary font-mono text-lg">{`I'm ready`}</Text>
            </TouchableOpacity>
          </View>
        </>
      )}
      {match?.status === MatchStatus.PLACING && ready && (
        <Text className="text-white mt-6 font-mono text-lg">
          Waiting for opponent to place ships...
        </Text>
      )}
    </View>
  );
};

export default MyTable;
