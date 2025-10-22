export enum MatchStatus {
  WAITING = "waiting",
  PLACING = "placing",
  IN_PROGRESS = "in_progress",
  FINISHED = "finished",
  CANCELLED = "cancelled",
}

export interface Match {
  code: string;
  created_at: string;
  host_player_id: string;
  id: string;
  is_private: boolean;
  name: string;
  status: MatchStatus;
  turn_player_id: string | null;
  winner_player_id: string | null;
}
