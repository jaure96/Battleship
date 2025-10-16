import { useMatch, UseMatchReturn } from "@/hooks/useMatch";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { createClient, SupabaseClient } from "@supabase/supabase-js";
import React, { createContext, useContext, useEffect, useState } from "react";

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY!;

const baseClient = createClient(supabaseUrl, supabaseAnonKey);

interface Player {
  id: string;
  username: string;
  token: string;
}

interface GameContextValue extends UseMatchReturn {
  supabase: SupabaseClient;
  playerId: string | null;
  createGuest: (username: string) => Promise<void>;
}

const GameContext = createContext<GameContextValue | undefined>(undefined);

export const GameProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [player, setPlayer] = useState<Player | null>(null);
  const [authedClient, setAuthedClient] = useState<SupabaseClient>(baseClient);

  const matchEngine = useMatch(authedClient, player?.id);

  useEffect(() => {
    const initPlayer = async () => {
      const stored = await AsyncStorage.getItem("player");
      if (stored) {
        const parsed: Player = JSON.parse(stored);
        const decoded = parseJwt(parsed.token);

        if (decoded && decoded.exp * 1000 > Date.now()) {
          // Valid token
          const authed = createClient(supabaseUrl, supabaseAnonKey, {
            global: { headers: { Authorization: `Bearer ${parsed.token}` } },
          });
          setAuthedClient(authed);
          setPlayer(parsed);
          return;
        } else {
          // Expired token
          await AsyncStorage.removeItem("player");
        }
      }
    };
    initPlayer();
  }, []);

  const createGuest = async (username: string) => {
    try {
      const stored = await AsyncStorage.getItem("player");
      if (stored) {
        const parsed: Player = JSON.parse(stored);
        const decoded = parseJwt(parsed.token);
        if (decoded && decoded.exp * 1000 > Date.now()) {
          setPlayer(parsed);
          const authed = createClient(supabaseUrl, supabaseAnonKey, {
            global: { headers: { Authorization: `Bearer ${parsed.token}` } },
          });
          setAuthedClient(authed);
          return;
        }
      }

      // Llama al edge function solo si es necesario
      const { data, error } = await baseClient.functions.invoke(
        "generate-guest-token",
        {
          body: { nickname: username },
        }
      );

      if (error) throw error;

      const token = data.token as string;
      const decoded = parseJwt(token);
      const id = decoded?.sub ?? crypto.randomUUID();

      const newPlayer = { id, username, token };
      await AsyncStorage.setItem("player", JSON.stringify(newPlayer));

      const authed = createClient(supabaseUrl, supabaseAnonKey, {
        global: { headers: { Authorization: `Bearer ${token}` } },
      });

      setAuthedClient(authed);
      setPlayer(newPlayer);
    } catch (err) {
      console.error("❌ Error creating guest:", err);
    }
  };

  const value: GameContextValue = {
    supabase: authedClient,
    playerId: player?.id ?? null,
    createGuest,
    ...matchEngine,
  };

  return <GameContext.Provider value={value}>{children}</GameContext.Provider>;
};

export const useGame = () => {
  const ctx = useContext(GameContext);
  if (!ctx) throw new Error("useGame must be used inside GameProvider");
  return ctx;
};

const parseJwt = (token: string): any => {
  try {
    const base64Url = token.split(".")[1];
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split("")
        .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
        .join("")
    );
    return JSON.parse(jsonPayload);
  } catch {
    return null;
  }
};
