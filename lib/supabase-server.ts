import "server-only";
import { createClient, type SupabaseClient } from "@supabase/supabase-js";

// 서버(API Routes)에서만 쓰는 Supabase 클라이언트.
// service role key 를 쓰므로 클라이언트 컴포넌트에서 절대 import 하지 않는다.
let client: SupabaseClient | null = null;

export function getSupabase(): SupabaseClient {
  if (client) return client;

  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) {
    throw new Error("SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY 환경 변수가 없습니다.");
  }

  client = createClient(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
  return client;
}
