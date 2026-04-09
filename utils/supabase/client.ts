import { createBrowserClient } from "@supabase/ssr";
import { SupabaseClient } from "@supabase/supabase-js";

let client: SupabaseClient | undefined;

export function createClient() {
  if (client) return client;

  client = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      auth: {
        // This prevents the "Lock was released because another request stole it" error
        // by disabling the navigator lock which can be finicky in some local dev environments.
        lock: (name, timeout, callback) => callback(),
      },
    },
  );
  return client;
}
