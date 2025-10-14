import { Move, MoveResult } from "@/types/move";
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

export const getCellMove = (
  moves: Move[],
  { x, y }: Coord
): MoveResult | null => {
  const move = moves.find((m) => m.x === x && m.y === y);
  if (!move) return null;
  return move.result;
};
