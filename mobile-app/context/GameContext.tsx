import { useMatch, UseMatchReturn } from "@/hooks/useMatch";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { createClient, SupabaseClient } from "@supabase/supabase-js";
import React, { createContext, useContext, useEffect, useState } from "react";

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY!;

const baseClient = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});

interface Player {
  id: string;
  username: string;
  token: string;
}

interface GameContextValue extends UseMatchReturn {
  supabase: SupabaseClient;
  playerId: string | null;
}

const GameContext = createContext<GameContextValue | undefined>(undefined);

export const GameProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [player, setPlayer] = useState<Player | null>(null);
  const [authedClient, setAuthedClient] = useState<SupabaseClient>(baseClient);

  const matchEngine = useMatch(authedClient, player?.id);

  useEffect(() => {
    const initAuth = async () => {
      const { data } = await baseClient.auth.getSession();

      if (data.session) {
        const { user, access_token } = data.session;
        const newPlayer = {
          id: user.id,
          username: user.user_metadata.username || "Guest",
          token: access_token,
        };
        await AsyncStorage.setItem("player", JSON.stringify(newPlayer));
        setPlayer(newPlayer);
        const authed = createClient(supabaseUrl, supabaseAnonKey, {
          global: { headers: { Authorization: `Bearer ${access_token}` } },
          auth: {
            storage: AsyncStorage,
            autoRefreshToken: true,
            persistSession: true,
            detectSessionInUrl: false,
          },
        });
        setAuthedClient(authed);
      } else {
        try {
          const { data: signInData, error: signInError } =
            await baseClient.auth.signInAnonymously();

          if (signInError) throw signInError;
          if (!signInData.session || !signInData.user)
            throw new Error(
              "No session or user returned after anonymous sign-in."
            );

          const { user, session } = signInData;
          const newPlayer = {
            id: user.id,
            username:
              user.user_metadata.username ||
              `Guest-${Math.floor(Math.random() * 1000)}`,
            token: session.access_token,
          };

          // Update user metadata with a default username if not already set
          if (!user.user_metadata.username) {
            await baseClient.auth.updateUser({
              data: { username: newPlayer.username },
            });
          }

          await AsyncStorage.setItem("player", JSON.stringify(newPlayer));
          setPlayer(newPlayer);
          const authed = createClient(supabaseUrl, supabaseAnonKey, {
            global: {
              headers: { Authorization: `Bearer ${session.access_token}` },
            },
            auth: {
              storage: AsyncStorage,
              autoRefreshToken: true,
              persistSession: true,
              detectSessionInUrl: false,
            },
          });
          setAuthedClient(authed);
        } catch (err) {
          console.error(
            "❌ GameContext: initAuth - Error creating anonymous guest:",
            err
          );
          await AsyncStorage.removeItem("player");
          setPlayer(null);
          setAuthedClient(baseClient);
        }
      }
    };

    initAuth();

    const { data: authListener } = baseClient.auth.onAuthStateChange(
      async (event, session) => {
        if (session) {
          const { user, access_token } = session;
          const newPlayer = {
            id: user.id,
            username: user.user_metadata.username || "Guest",
            token: access_token,
          };
          await AsyncStorage.setItem("player", JSON.stringify(newPlayer));
          setPlayer(newPlayer);
          const authed = createClient(supabaseUrl, supabaseAnonKey, {
            global: { headers: { Authorization: `Bearer ${access_token}` } },
            auth: {
              storage: AsyncStorage,
              autoRefreshToken: true,
              persistSession: true,
              detectSessionInUrl: false,
            },
          });
          setAuthedClient(authed);
        } else {
          await AsyncStorage.removeItem("player");
          setPlayer(null);
          setAuthedClient(baseClient);
        }
      }
    );

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  const value: GameContextValue = {
    supabase: authedClient,
    playerId: player?.id ?? null,
    ...matchEngine,
  };

  return <GameContext.Provider value={value}>{children}</GameContext.Provider>;
};

export const useGame = () => {
  const ctx = useContext(GameContext);
  if (!ctx) throw new Error("useGame must be used inside GameProvider");
  return ctx;
};
