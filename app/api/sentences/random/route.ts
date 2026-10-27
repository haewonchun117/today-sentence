import type { NextRequest } from "next/server";
import { getSupabase } from "@/lib/supabase-server";
import {
  SENTENCE_SELECT,
  badRequest,
  isCategory,
  notFound,
  parseId,
  serverError,
  toSentence,
} from "@/lib/api";

export async function GET(request: NextRequest) {
  const params = request.nextUrl.searchParams;
  const category = params.get("category");
  const excludeParam = params.get("exclude");

  const exclude = excludeParam === null ? null : parseId(excludeParam);
  if (excludeParam !== null && exclude === null) {
    return badRequest("exclude 는 양의 정수여야 해요.");
  }

  try {
    if (category !== null && !(await isCategory(category))) {
      return badRequest("없는 카테고리예요.");
    }

    const supabase = getSupabase();
    const query = () => {
      let q = supabase.from("sentences").select(SENTENCE_SELECT, { count: "exact" });
      if (category !== null) q = q.eq("category_id", category);
      if (exclude !== null) q = q.neq("id", exclude);
      return q;
    };

    const { count, error: countError } = await query().limit(0);
    if (countError) throw countError;
    if (!count) return notFound("뽑을 문장이 없어요.");

    const index = Math.floor(Math.random() * count);
    const { data, error } = await query().order("id").range(index, index).single();
    if (error) throw error;

    return Response.json({ sentence: toSentence(data) });
  } catch (err) {
    return serverError(err);
  }
}
