import { useMatch, UseMatchReturn } from "@/hooks/useMatch";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { createClient, SupabaseClient } from "@supabase/supabase-js";
import React, { createContext, useContext, useEffect, useState } from "react";

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY!;

const supabaseClient = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});

interface GameContextValue extends UseMatchReturn {
  supabase: SupabaseClient;
  playerId: string | null;
  isAuthReady: boolean;
}

const GameContext = createContext<GameContextValue | undefined>(undefined);

export const GameProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [playerId, setPlayerId] = useState<string | null>(null);
  const [isAuthReady, setIsAuthReady] = useState(false);

  const matchEngine = useMatch(supabaseClient, playerId ?? undefined);

  useEffect(() => {
    // Initialize authentication
    const initAuth = async () => {
      try {
        const { data } = await supabaseClient.auth.getSession();

        if (data.session?.user) {
          // User already logged in
          setPlayerId(data.session.user.id);
          setIsAuthReady(true);
        } else {
          // Create anonymous session
          const { data: signInData, error } =
            await supabaseClient.auth.signInAnonymously();

          if (error) throw error;

          const userId = signInData.user?.id;
          if (!userId) throw new Error("No user ID returned");

          // Update metadata with generated username if not already set
          if (!signInData.user?.user_metadata?.username) {
            await supabaseClient.auth.updateUser({
              data: { username: `Guest-${Math.floor(Math.random() * 1000)}` },
            });
          }

          setPlayerId(userId);
          setIsAuthReady(true);
        }
      } catch (err) {
        console.error(
          "❌ GameContext: Failed to initialize authentication:",
          err
        );
        setIsAuthReady(false);
      }
    };

    initAuth();

    // Listen for auth state changes
    const { data: authListener } = supabaseClient.auth.onAuthStateChange(
      (event, session) => {
        if (session?.user) {
          setPlayerId(session.user.id);
          setIsAuthReady(true);
        } else {
          setPlayerId(null);
          setIsAuthReady(false);
        }
      }
    );

    return () => {
      authListener?.subscription.unsubscribe();
    };
  }, []);

  const value: GameContextValue = {
    supabase: supabaseClient,
    playerId,
    isAuthReady,
    ...matchEngine,
  };

  return <GameContext.Provider value={value}>{children}</GameContext.Provider>;
};

export const useGame = () => {
  const ctx = useContext(GameContext);
  if (!ctx) throw new Error("useGame must be used inside GameProvider");
  return ctx;
};
