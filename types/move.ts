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
