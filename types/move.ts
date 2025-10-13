export enum MoveResult {
  MISS = "miss",
  HIT = "hit",
  SUNK = "sunk",
}

export interface MoveResponse {
  move_id: string;
  result: MoveResult;
  sunk_ship_id: string;
  move_number: number;
  match_finished: boolean;
  winner: string;
}
