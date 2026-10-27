import "server-only";
import { getSupabase } from "@/lib/supabase-server";
import type { Sentence } from "@/lib/types";

// 문장 + 카테고리를 한 번에 가져올 때 쓰는 select 문
export const SENTENCE_SELECT = "id, content, author, category:categories(id, name)";

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
const CATEGORY_RE = /^[a-z]{1,30}$/;

export function isDeviceId(value: unknown): value is string {
  return typeof value === "string" && UUID_RE.test(value);
}

// 양의 정수(숫자 또는 숫자 문자열)만 허용. 아니면 null
export function parseId(value: unknown): number | null {
  if (typeof value === "number") {
    return Number.isSafeInteger(value) && value > 0 ? value : null;
  }
  if (typeof value === "string" && /^[1-9]\d{0,15}$/.test(value)) {
    const n = Number(value);
    return Number.isSafeInteger(n) ? n : null;
  }
  return null;
}

// 카테고리 형식 확인 + DB에 실제로 있는지 확인
export async function isCategory(value: string): Promise<boolean> {
  if (!CATEGORY_RE.test(value)) return false;
  const { count, error } = await getSupabase()
    .from("categories")
    .select("id", { count: "exact", head: true })
    .eq("id", value);
  if (error) throw error;
  return (count ?? 0) > 0;
}

export function badRequest(message: string) {
  return Response.json({ error: message }, { status: 400 });
}

export function notFound(message: string) {
  return Response.json({ error: message }, { status: 404 });
}

export function serverError(err: unknown) {
  console.error(err);
  return Response.json({ error: "서버 오류가 발생했어요." }, { status: 500 });
}

// supabase 의 중첩 select 결과를 Sentence 형태로 정리
type SentenceRow = {
  id: number;
  content: string;
  author: string;
  category: { id: string; name: string } | { id: string; name: string }[] | null;
};

export function toSentence(row: SentenceRow): Sentence {
  const category = Array.isArray(row.category) ? row.category[0] : row.category;
  return {
    id: row.id,
    content: row.content,
    author: row.author,
    category: category ?? { id: "", name: "" },
  };
}
