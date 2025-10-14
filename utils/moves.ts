import { Move, MoveResult, SimpleMove } from "@/types/move";
import { Coord } from "@/types/ship";

const getFilteredMoves = (
  moves: Move[],
  userId: string | null,
  getMyMoves: boolean
): SimpleMove[] => {
  return moves.reduce<SimpleMove[]>((acc, move) => {
    const isMyMove = move.by_player_id === userId;
    if ((getMyMoves && isMyMove) || (!getMyMoves && !isMyMove)) {
      acc.push({
        x: move.x,
        y: move.y,
        result: move.result,
      });
    }
    return acc;
  }, []);
};
export const getMyMoves = (
  moves: Move[],
  userId: string | null
): SimpleMove[] => getFilteredMoves(moves, userId, true);

export const getEnemyMoves = (
  moves: Move[],
  userId: string | null
): SimpleMove[] => getFilteredMoves(moves, userId, false);

export const getCellMove = (
  moves: SimpleMove[],
  { x, y }: Coord
): MoveResult | null => {
  const move = moves.find((m) => m.x === x && m.y === y);
  if (!move) return null;
  return move.result;
};
