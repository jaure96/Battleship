import { Move, MoveResult } from "@/types/move";
import { Player } from "@/types/player";
import { Coord } from "@/types/ship";

const getFilteredMoves = (
  moves: Move[],
  userId: string | null,
  getMyMoves: boolean
): Move[] => {
  return moves.reduce<Move[]>((acc, move) => {
    const isMyMove = move.by_player_id === userId;
    if ((getMyMoves && isMyMove) || (!getMyMoves && !isMyMove)) acc.push(move);
    return acc;
  }, []);
};
export const getMyMoves = (moves: Move[], userId: string | null): Move[] =>
  getFilteredMoves(moves, userId, true);

export const getEnemyMoves = (moves: Move[], userId: string | null): Move[] =>
  getFilteredMoves(moves, userId, false);

export const getCellMove = (moves: Move[], { x, y }: Coord): Move | null => {
  const move = moves.find((m) => m.x === x && m.y === y);
  if (!move) return null;
  return move;
};

export const getEnemySunkCells = (
  players: Player[],
  move: Move | null,
  playerId: string | null
): Coord[] => {
  if (move == null) return [];
  if (move.result !== MoveResult.SUNK || !move.sunk_ship_id) return [];
  const enemyPlayer = players.find((player) => player.id !== playerId);
  if (!enemyPlayer) return [];
  const sunkShip = enemyPlayer.ships.find(
    (ship) => ship.id === move.sunk_ship_id
  );
  if (!sunkShip) return [];
  return sunkShip.coords;
};
