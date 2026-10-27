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
import type { SavedSentence } from "@/lib/types";

// POST / DELETE 공통 body 검증
async function readBody(request: NextRequest) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return { error: badRequest("JSON body 가 필요해요.") };
  }
  const { deviceId, sentenceId } = (body ?? {}) as Record<string, unknown>;
  if (!isDeviceId(deviceId)) return { error: badRequest("deviceId 형식이 올바르지 않아요.") };
  const id = parseId(sentenceId);
  if (id === null) return { error: badRequest("sentenceId 는 양의 정수여야 해요.") };
  return { deviceId, sentenceId: id };
}

export async function GET(request: NextRequest) {
  const deviceId = request.nextUrl.searchParams.get("deviceId");
  if (!isDeviceId(deviceId)) return badRequest("deviceId 형식이 올바르지 않아요.");

  try {
    const { data, error } = await getSupabase()
      .from("saved_sentences")
      .select(`created_at, sentence:sentences(${SENTENCE_SELECT})`)
      .eq("device_id", deviceId)
      .order("created_at", { ascending: false });
    if (error) throw error;

    const saved: SavedSentence[] = data.flatMap((row) => {
      const sentence = Array.isArray(row.sentence) ? row.sentence[0] : row.sentence;
      return sentence ? [{ savedAt: row.created_at, sentence: toSentence(sentence) }] : [];
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
