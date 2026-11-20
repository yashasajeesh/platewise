import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { createClient } from "@supabase/supabase-js";
import type { Database } from "./types";

function getSupabaseUrl(): string {
  const url =
    process.env["SUPABASE_URL"] ||
    process.env["VITE_SUPABASE_URL"] ||
    (typeof import.meta !== "undefined" &&
      import.meta.env &&
      import.meta.env["VITE_SUPABASE_URL"]) ||
    "";
  return url.replace(/\/+$/, "");
}

function getSupabaseServiceRoleKey(): string {
  return process.env["SUPABASE_SERVICE_ROLE_KEY"] || "";
}

function getSupabaseAnonKey(): string {
  return (
    process.env["SUPABASE_ANON_KEY"] ||
    process.env["SUPABASE_PUBLISHABLE_KEY"] ||
    process.env["VITE_SUPABASE_ANON_KEY"] ||
    process.env["VITE_SUPABASE_PUBLISHABLE_KEY"] ||
    (typeof import.meta !== "undefined" &&
      import.meta.env &&
      (import.meta.env["VITE_SUPABASE_ANON_KEY"] ||
        import.meta.env["VITE_SUPABASE_PUBLISHABLE_KEY"])) ||
    ""
  );
}

/**
 * Creates a server-side Supabase client with cookie-based auth session storage.
 * Use this in server functions and request handlers when you need to interact with Supabase
 * using the authenticated user's session and RLS policies.
 */
export function createSupabaseServerClient(cookieStore?: {
  get: (name: string) => string | undefined;
  set?: (name: string, value: string, options: CookieOptions) => void;
  remove?: (name: string, options: CookieOptions) => void;
}) {
  const url = getSupabaseUrl();
  const anonKey = getSupabaseAnonKey();

  if (!url || !anonKey) {
    throw new Error("Missing SUPABASE_URL or SUPABASE_ANON_KEY environment variables.");
  }

  return createServerClient<Database>(url, anonKey, {
    cookies: {
      get(name: string) {
        return cookieStore?.get(name);
      },
      set(name: string, value: string, options: CookieOptions) {
        cookieStore?.set?.(name, value, options);
      },
      remove(name: string, options: CookieOptions) {
        cookieStore?.remove?.(name, options);
      },
    },
  });
}

function createSupabaseAdminClient() {
  const url = getSupabaseUrl();
  const serviceKey = getSupabaseServiceRoleKey();

  if (!url || !serviceKey) {
    const missing: string[] = [];
    if (!url) missing.push("SUPABASE_URL");
    if (!serviceKey) missing.push("SUPABASE_SERVICE_ROLE_KEY");
    console.warn(`[Supabase Admin] Missing environment variable(s): ${missing.join(", ")}.`);
  }

  return createClient<Database>(
    url || "https://placeholder.supabase.co",
    serviceKey || "placeholder-key",
    {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
      },
    },
  );
}

let _supabaseAdmin: ReturnType<typeof createSupabaseAdminClient> | undefined;

// Server-side Supabase client with service role key - bypasses RLS
export const supabaseAdmin = new Proxy({} as ReturnType<typeof createSupabaseAdminClient>, {
  get(_, prop, receiver) {
    if (!_supabaseAdmin) _supabaseAdmin = createSupabaseAdminClient();
    return Reflect.get(_supabaseAdmin, prop, receiver);
  },
});
