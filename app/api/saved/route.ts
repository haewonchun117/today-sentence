import type { NextRequest } from "next/server";
import { getSupabase } from "@/lib/supabase-server";
import {
  SENTENCE_SELECT,
  badRequest,
  isDeviceId,
  notFound,
  parseId,
  serverError,
  toSentence,
} from "@/lib/api";
import { MEMO_MAX_LENGTH, type SavedSentence } from "@/lib/types";

// POST / PATCH / DELETE 공통 body 검증
async function readBody(request: NextRequest) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return { error: badRequest("JSON body 가 필요해요.") };
  }
  const fields = (body ?? {}) as Record<string, unknown>;
  const { deviceId, sentenceId } = fields;
  if (!isDeviceId(deviceId)) return { error: badRequest("deviceId 형식이 올바르지 않아요.") };
  const id = parseId(sentenceId);
  if (id === null) return { error: badRequest("sentenceId 는 양의 정수여야 해요.") };
  return { deviceId, sentenceId: id, fields };
}

export async function GET(request: NextRequest) {
  const deviceId = request.nextUrl.searchParams.get("deviceId");
  if (!isDeviceId(deviceId)) return badRequest("deviceId 형식이 올바르지 않아요.");

  try {
    const { data, error } = await getSupabase()
      .from("saved_sentences")
      .select(`created_at, memo, memo_updated_at, sentence:sentences(${SENTENCE_SELECT})`)
      .eq("device_id", deviceId)
      .order("created_at", { ascending: false });
    if (error) throw error;

    const saved: SavedSentence[] = data.flatMap((row) => {
      const sentence = Array.isArray(row.sentence) ? row.sentence[0] : row.sentence;
      if (!sentence) return [];
      return [
        {
          savedAt: row.created_at,
          memo: row.memo ?? "",
          memoUpdatedAt: row.memo_updated_at,
          sentence: toSentence(sentence),
        },
      ];
    });
    return Response.json({ saved });
  } catch (err) {
    return serverError(err);
  }
}

export async function POST(request: NextRequest) {
  const body = await readBody(request);
  if ("error" in body) return body.error;

  try {
    const { error } = await getSupabase()
      .from("saved_sentences")
      .upsert(
        { device_id: body.deviceId, sentence_id: body.sentenceId },
        { onConflict: "device_id,sentence_id", ignoreDuplicates: true },
      );
    // 23503: 없는 문장 id (foreign key 위반)
    if (error?.code === "23503") return notFound("없는 문장이에요.");
    if (error) throw error;

    return Response.json({ ok: true });
  } catch (err) {
    return serverError(err);
  }
}

// 내 생각 메모 쓰기/수정/지우기. 빈 문자열(또는 null)을 보내면 메모를 지운다
export async function PATCH(request: NextRequest) {
  const body = await readBody(request);
  if ("error" in body) return body.error;

  const { memo } = body.fields;
  if (memo !== null && typeof memo !== "string") {
    return badRequest("memo 는 문자열이어야 해요. 지우려면 빈 문자열을 보내 주세요.");
  }
  const text = (memo ?? "").trim();
  if (text.length > MEMO_MAX_LENGTH) {
    return badRequest(`메모는 ${MEMO_MAX_LENGTH}자까지 쓸 수 있어요.`);
  }

  try {
    // memo 컬럼은 not null default '' 이므로 메모가 없으면 빈 문자열로 둔다
    const { data, error } = await getSupabase()
      .from("saved_sentences")
      .update({ memo: text, memo_updated_at: text ? new Date().toISOString() : null })
      .eq("device_id", body.deviceId)
      .eq("sentence_id", body.sentenceId)
      .select("memo, memo_updated_at")
      .maybeSingle();
    if (error) throw error;
    if (!data) return notFound("저장하지 않은 문장이에요.");

    return Response.json({ memo: data.memo, memoUpdatedAt: data.memo_updated_at });
  } catch (err) {
    return serverError(err);
  }
}

export async function DELETE(request: NextRequest) {
  const body = await readBody(request);
  if ("error" in body) return body.error;

  try {
    const { error } = await getSupabase()
      .from("saved_sentences")
      .delete()
      .eq("device_id", body.deviceId)
      .eq("sentence_id", body.sentenceId);
    if (error) throw error;

    return Response.json({ ok: true });
  } catch (err) {
    return serverError(err);
  }
}
