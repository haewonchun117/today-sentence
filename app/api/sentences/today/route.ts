import { connection } from "next/server";
import { getSupabase } from "@/lib/supabase-server";
import { SENTENCE_SELECT, notFound, serverError, toSentence } from "@/lib/api";

// 한국 시간 기준 오늘 날짜 (YYYY-MM-DD)
function seoulDate(): string {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Seoul",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(new Date());
}

function gcd(a: number, b: number): number {
  return b === 0 ? a : gcd(b, a % b);
}

// 날짜 → 문장 순번. count 와 서로소인 간격으로 건너뛰어
// 매일 다른 문장이 나오고, count 일 동안은 겹치지 않는다.
function dayIndex(date: string, count: number): number {
  const day = Math.floor(Date.parse(`${date}T00:00:00Z`) / 86_400_000);
  let step = 7;
  while (gcd(step, count) !== 1) step++;
  return (((day * step) % count) + count) % count;
}

export async function GET() {
  await connection(); // 날짜에 따라 달라지므로 요청 시점에 실행

  try {
    const supabase = getSupabase();
    const date = seoulDate();

    const { count, error: countError } = await supabase
      .from("sentences")
      .select("id", { count: "exact", head: true });
    if (countError) throw countError;
    if (!count) return notFound("문장이 아직 없어요.");

    const index = dayIndex(date, count);
    const { data, error } = await supabase
      .from("sentences")
      .select(SENTENCE_SELECT)
      .order("id")
      .range(index, index)
      .single();
    if (error) throw error;

    return Response.json({ date, sentence: toSentence(data) });
  } catch (err) {
    return serverError(err);
  }
}
