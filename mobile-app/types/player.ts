import { Ship } from "./ship";

export interface Player {
  display_name: string | null;
  id: string;
  joined_at: string;
  match_id: string;
  ready: true;
  ships: Ship[];
  slot: number;
}
