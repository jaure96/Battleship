import { createClient, SupabaseClient } from "@supabase/supabase-js";

export const createSupabaseClient = (
  supabaseUrl: string,
  supabaseKey: string,
  jwt?: string
): SupabaseClient => {
  if (jwt) {
    // Pass jwt to constructor so it will use Authorization header automatically
    return createClient(supabaseUrl, supabaseKey, {
      global: { headers: { Authorization: `Bearer ${jwt}` } },
    });
  }
  return createClient(supabaseUrl, supabaseKey);
};
