import { Match } from "@/types/match";
import { Move, MoveResponse } from "@/types/move";
import { Player } from "@/types/player";
import { Ship } from "@/types/ship";
import { useEffect, useRef, useState } from "react";
import { useGame } from "../context/GameContext";

export const useMatch = (matchId: string | null) => {
  const { supabase, playerId, setMatch } = useGame();
  const [players, setPlayers] = useState<Player[]>([]);
  const [moves, setMoves] = useState<Move[]>([]);
  const channelRefs = useRef<{ match?: any; players?: any; moves?: any }>({});

  useEffect(() => {
    if (!matchId || !supabase) return;
    let mounted = true;

    (async () => {
      try {
        const [{ data: m }, { data: pls }, { data: ms }] = await Promise.all([
          supabase.from("matches").select("*").eq("id", matchId).single(),
          supabase.from("match_players").select("*").eq("match_id", matchId),
          supabase
            .from("moves")
            .select("*")
            .eq("match_id", matchId)
            .order("move_number", { ascending: true }),
        ]);

        if (!mounted) return;

        setMatch(m);
        setPlayers(pls ?? []);
        setMoves(ms ?? []);
      } catch (error) {
        console.error("Error loading match data:", error);
      }
    })();

    const matchChannel = supabase
      .channel(`public:matches:id=eq.${matchId}`)
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "matches",
          filter: `id=eq.${matchId}`,
        },
        (payload) => {
          setMatch((currentMatch: Match) => {
            if (payload.eventType === "DELETE") {
              return null;
            }
            return payload.new || currentMatch;
          });
        }
      )
      .subscribe();

    const playersChannel = supabase
      .channel(`public:match_players:match_id=eq.${matchId}`)
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "match_players",
          filter: `match_id=eq.${matchId}`,
        },
        async () => {
          const { data: pls } = await supabase
            .from("match_players")
            .select("*")
            .eq("match_id", matchId);
          if (mounted) setPlayers(pls ?? []);
        }
      )
      .subscribe();

    const movesChannel = supabase
      .channel(`public:moves:match_id=eq.${matchId}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "moves",
          filter: `match_id=eq.${matchId}`,
        },
        (payload) => {
          if (mounted) setMoves((prev) => [...prev, payload.new] as Move[]);
        }
      )
      .subscribe();

    channelRefs.current = {
      match: matchChannel,
      players: playersChannel,
      moves: movesChannel,
    };

    return () => {
      mounted = false;
      Object.values(channelRefs.current).forEach((channel) => {
        if (channel) supabase.removeChannel(channel);
      });
      channelRefs.current = {};
    };
  }, [matchId, supabase, setMatch]);

  const createMatch = async (
    name: string,
    isPrivate = false,
    displayName?: string
  ): Promise<{ data: Match | null; error: any }> => {
    if (!supabase || !playerId) throw new Error("No supabase or playerId");
    return supabase.rpc("rpc_create_match", {
      p_name: name,
      p_is_private: isPrivate,
      p_host_player_id: playerId,
      p_display_name: displayName ?? null,
    }) as unknown as Promise<{ data: Match | null; error: any }>;
  };

  const joinMatchByCode = async (
    code: string,
    display_name?: string
  ): Promise<{ data: Match | null; error: any }> => {
    if (!supabase || !playerId) throw new Error("No supabase or playerId");
    return supabase.rpc("rpc_join_match_by_code", {
      p_code: code,
      p_player_id: playerId,
      p_display_name: display_name ?? null,
    });
  };

  const setShipsAndReady = async (
    shipsJson: Ship[],
    ready: boolean
  ): Promise<{ data: any | null; error: any }> => {
    if (!supabase || !playerId || !matchId) throw new Error("missing");
    return supabase.rpc("rpc_set_ships_and_ready", {
      p_match_id: matchId,
      p_player_id: playerId,
      p_ships: shipsJson,
      p_ready: ready,
    });
  };

  const makeMove = async (
    x: number,
    y: number
  ): Promise<{ data: MoveResponse | null; error: any }> => {
    if (!supabase || !playerId || !matchId) throw new Error("missing");
    return supabase.rpc("rpc_make_move", {
      p_match_id: matchId,
      p_by_player_id: playerId,
      p_x: x,
      p_y: y,
    });
  };

  return {
    players,
    moves,
    createMatch,
    joinMatchByCode,
    setShipsAndReady,
    makeMove,
  };
};
