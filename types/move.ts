export enum MoveResult {
  MISS = "miss",
  HIT = "hit",
  SUNK = "sunk",
}

export interface MoveResponse {
  out_move_id: string;
  out_result: MoveResult;
  out_sunk_ship_id: string;
  out_move_number: number;
  out_match_finished: boolean;
  out_winner: string;
}

export interface Move {
  by_player_id: string;
  created_at: string;
  id: string;
  match_id: string;
  move_number: number;
  result: MoveResult;
  sunk_ship_id: string | null;
  x: number;
  y: number;
}

export interface SimpleMove {
  x: number;
  y: number;
  result: MoveResult;
}
