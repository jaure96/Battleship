import { Match } from "@/types/match";
import { SupabaseClient } from "@supabase/supabase-js";
import { useEffect, useState } from "react";

export const usePublicMatches = (
  supabase: SupabaseClient<any, "public", "public", any, any> | null
) => {
  const [matches, setMatches] = useState<Match[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!supabase) {
      setLoading(false);
      return;
    }

    let mounted = true;

    const fetchPublicMatches = async () => {
      try {
        setLoading(true);
        setError(null);

        const { data, error: fetchError } = await supabase
          .from("matches")
          .select("*, match_players!inner(id)")
          .eq("is_private", false)
          .eq("status", "waiting")
          .order("created_at", { ascending: false })
          .limit(10);

        if (fetchError) throw fetchError;

        // Remove duplicates (matches with multiple players will appear multiple times)
        const uniqueMatches = Array.from(
          new Map(data?.map((match: any) => [match.id, match]) ?? []).values()
        ).map((match: any) => {
          const { match_players, ...rest } = match;
          return rest;
        });

        if (mounted) {
          setMatches(uniqueMatches);
        }
      } catch (err) {
        if (mounted) {
          setError(
            err instanceof Error ? err.message : "Failed to fetch matches"
          );
          setMatches([]);
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    fetchPublicMatches();
  }, [supabase]);

  return {
    matches,
    loading,
    error,
  };
};

export type UsePublicMatchesReturn = ReturnType<typeof usePublicMatches>;
