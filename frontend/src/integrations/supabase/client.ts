import { createBrowserClient } from "@supabase/ssr";
import type { Database } from "./types";

function getSupabaseUrl(): string {
  const url =
    (typeof import.meta !== "undefined" &&
      import.meta.env &&
      import.meta.env["VITE_SUPABASE_URL"]) ||
    process.env["VITE_SUPABASE_URL"] ||
    process.env["SUPABASE_URL"] ||
    "";
  return url.replace(/\/+$/, "");
}

function getSupabaseKey(): string {
  return (
    (typeof import.meta !== "undefined" &&
      import.meta.env &&
      (import.meta.env["VITE_SUPABASE_ANON_KEY"] ||
        import.meta.env["VITE_SUPABASE_PUBLISHABLE_KEY"])) ||
    process.env["VITE_SUPABASE_ANON_KEY"] ||
    process.env["VITE_SUPABASE_PUBLISHABLE_KEY"] ||
    process.env["SUPABASE_ANON_KEY"] ||
    process.env["SUPABASE_PUBLISHABLE_KEY"] ||
    ""
  );
}

function createSupabaseClient() {
  const url = getSupabaseUrl();
  const key = getSupabaseKey();

  if (!url || !key) {
    const missing: string[] = [];
    if (!url) missing.push("SUPABASE_URL / VITE_SUPABASE_URL");
    if (!key) missing.push("SUPABASE_ANON_KEY / VITE_SUPABASE_ANON_KEY");
    console.warn(`[Supabase] Missing environment variable(s): ${missing.join(", ")}.`);
  }

  return createBrowserClient<Database>(
    url || "https://placeholder.supabase.co",
    key || "placeholder-key",
  );
}

let _supabase: ReturnType<typeof createSupabaseClient> | undefined;

// Client-side Supabase client with standard cookie storage via @supabase/ssr
export const supabase = new Proxy({} as ReturnType<typeof createSupabaseClient>, {
  get(_, prop, receiver) {
    if (!_supabase) _supabase = createSupabaseClient();
    return Reflect.get(_supabase, prop, receiver);
  },
});
