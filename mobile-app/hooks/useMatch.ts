import { Match } from "@/types/match";
import { Move, MoveResponse } from "@/types/move";
import { Player } from "@/types/player";
import { Ship } from "@/types/ship";
import { SupabaseClient } from "@supabase/supabase-js";
import { useCallback, useEffect, useRef, useState } from "react";

// Configuración de reintentos para reconexión
const RECONNECT_ATTEMPTS = 5;
const RECONNECT_DELAY_MS = 2000;

export const useMatch = (
  supabase: SupabaseClient<any, "public", "public", any, any>,
  playerId: string | undefined
) => {
  const [match, setMatch] = useState<Match | null>(null);

  const [players, setPlayers] = useState<Player[]>([]);
  const [moves, setMoves] = useState<Move[]>([]);
  const channelRefs = useRef<{ match?: any; players?: any; moves?: any }>({});
  const reconnectAttemptsRef = useRef<{
    match: number;
    players: number;
    moves: number;
  }>({
    match: 0,
    players: 0,
    moves: 0,
  });

  /**
   * Función para reconectar un canal específico con reintentos
   */
  const reconnectChannel = useCallback(
    async (
      channelName: keyof typeof channelRefs.current,
      setupChannel: () => any
    ) => {
      const attempts = reconnectAttemptsRef.current[channelName] || 0;

      if (attempts >= RECONNECT_ATTEMPTS) {
        console.error(
          `[${channelName}] Max reconnection attempts reached (${RECONNECT_ATTEMPTS})`
        );
        return;
      }

      try {
        console.log(
          `[${channelName}] Attempting reconnection (${
            attempts + 1
          }/${RECONNECT_ATTEMPTS})`
        );

        // Limpiar canal anterior
        const oldChannel = channelRefs.current[channelName];
        if (oldChannel) {
          try {
            await oldChannel.unsubscribe();
            supabase?.removeChannel(oldChannel);
          } catch (err) {
            console.warn(`Error cleaning up old ${channelName} channel:`, err);
          }
        }

        // Configurar nuevo canal
        const newChannel = setupChannel();
        channelRefs.current[channelName] = newChannel;

        // Resetear contador de intentos
        reconnectAttemptsRef.current[channelName] = 0;
        console.log(`[${channelName}] Reconnected successfully`);
      } catch (error) {
        reconnectAttemptsRef.current[channelName] = attempts + 1;

        // Programar reintento con backoff exponencial
        const delay = RECONNECT_DELAY_MS * Math.pow(2, attempts);
        console.warn(
          `[${channelName}] Reconnection failed, retrying in ${delay}ms:`,
          error
        );

        setTimeout(() => {
          reconnectChannel(channelName, setupChannel);
        }, delay);
      }
    },
    [supabase]
  );

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      Object.entries(channelRefs.current).forEach(([key, channel]) => {
        if (channel) {
          try {
            channel.unsubscribe().then(() => {
              supabase?.removeChannel(channel);
            });
          } catch (error) {
            console.warn(`Error cleaning up ${key} channel:`, error);
          }
        }
      });
      channelRefs.current = {};
    };
  }, [supabase]);

  // Effect to subscribe to match changes with auto-reconnection
  useEffect(() => {
    if (!match?.id || !supabase) return;

    const matchId = match.id;

    // Clean up previous channels before subscribing to new ones
    Object.entries(channelRefs.current).forEach(([key, channel]) => {
      if (channel) {
        try {
          channel.unsubscribe().then(() => {
            supabase.removeChannel(channel);
          });
        } catch (error) {
          console.warn(`Error cleaning up ${key} channel:`, error);
        }
      }
    });
    channelRefs.current = {};
    // Reset reconnect attempts when entering a new match
    reconnectAttemptsRef.current = { match: 0, players: 0, moves: 0 };

    // Setup Match channel with error handling
    const setupMatchChannel = () => {
      return supabase
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
            if (payload.eventType === "DELETE") {
              setMatch(null);
            } else {
              setMatch(payload.new as Match);
            }
          }
        )
        .subscribe((status, e) => {
          if (status === "CHANNEL_ERROR") {
            console.error("Match channel subscription error:", e);
            reconnectChannel("match", setupMatchChannel);
          } else if (status === "SUBSCRIBED") {
            console.log("Match channel subscribed successfully");
          }
        });
    };

    // Setup Players channel with error handling
    const setupPlayersChannel = () => {
      return supabase
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
            try {
              const { data: pls } = await supabase
                .from("match_players")
                .select("*")
                .eq("match_id", matchId);
              setPlayers(pls ?? []);
            } catch (error) {
              console.error("Error fetching players:", error);
            }
          }
        )
        .subscribe((status, e) => {
          if (status === "CHANNEL_ERROR") {
            console.error("Players channel subscription error:", e);
            reconnectChannel("players", setupPlayersChannel);
          } else if (status === "SUBSCRIBED") {
            console.log("Players channel subscribed successfully");
          }
        });
    };

    // Setup Moves channel with error handling
    const setupMovesChannel = () => {
      return supabase
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
            setMoves((prev) => [...prev, payload.new] as Move[]);
          }
        )
        .subscribe((status, e) => {
          if (status === "CHANNEL_ERROR") {
            console.error("Moves channel subscription error:", e);
            reconnectChannel("moves", setupMovesChannel);
          } else if (status === "SUBSCRIBED") {
            console.log("Moves channel subscribed successfully");
          }
        });
    };

    // Subscribe to all channels
    channelRefs.current = {
      match: setupMatchChannel(),
      players: setupPlayersChannel(),
      moves: setupMovesChannel(),
    };

    return () => {
      Object.entries(channelRefs.current).forEach(([key, channel]) => {
        if (channel) {
          try {
            channel.unsubscribe().then(() => {
              supabase.removeChannel(channel);
            });
          } catch (error) {
            console.warn(`Error cleaning up ${key} channel:`, error);
          }
        }
      });
      channelRefs.current = {};
    };
  }, [match?.id, supabase, reconnectChannel]);

  const createMatch = async (
    name: string,
    isPrivate = false,
    displayName?: string
  ): Promise<{ data: Match | null; error: any }> => {
    if (!supabase || !playerId) throw new Error("No supabase or playerId");
    const result = await (supabase.rpc("rpc_create_match", {
      p_name: name,
      p_is_private: isPrivate,
      p_host_player_id: playerId,
      p_display_name: displayName ?? null,
    }) as unknown as Promise<{ data: Match | null; error: any }>);

    if (result.data) setMatch(result.data);
    return result;
  };

  const joinMatchByCode = async (
    code: string,
    display_name?: string
  ): Promise<{ data: Match | null; error: any }> => {
    if (!supabase || !playerId) throw new Error("No supabase or playerId");
    const result = await supabase.rpc("rpc_join_match_by_code", {
      p_code: code,
      p_player_id: playerId,
      p_display_name: display_name ?? null,
    });

    if (result.data) setMatch(result.data as Match);
    return result;
  };

  const setShipsAndReady = async (
    shipsJson: Ship[],
    ready: boolean
  ): Promise<{ data: any | null; error: any }> => {
    if (!supabase || !playerId || !match?.id) throw new Error("missing");
    return supabase.rpc("rpc_set_ships_and_ready", {
      p_match_id: match.id,
      p_player_id: playerId,
      p_ships: shipsJson,
      p_ready: ready,
    });
  };

  const makeMove = async (
    x: number,
    y: number
  ): Promise<{ data: MoveResponse | null; error: any }> => {
    if (!supabase || !playerId || !match?.id) throw new Error("missing");
    return supabase.rpc("rpc_make_move", {
      p_match_id: match.id,
      p_by_player_id: playerId,
      p_x: x,
      p_y: y,
    });
  };

  const cancelMatch = async (
    matchIdToCancel: string
  ): Promise<{ data: Match | null; error: any }> => {
    if (!supabase) throw new Error("No supabase");
    return supabase.rpc("rpc_cancel_match", {
      p_match_id: matchIdToCancel,
    });
  };

  return {
    players,
    moves,
    match,
    createMatch,
    joinMatchByCode,
    setShipsAndReady,
    makeMove,
    cancelMatch,
  };
};

export type UseMatchReturn = ReturnType<typeof useMatch>;
